import express, { Request, Response } from "express";
import Hotel from "../models/hotel";
import { BookingType, HotelSearchResponse } from "../shared/types";
import { param, validationResult } from "express-validator";
import Razorpay from "razorpay";
import verifyToken from "../middleware/auth";
import bodyParser from 'body-parser';


const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID as string;
const RAZORPAY_SECRET_KEY = process.env.RAZORPAY_SECRET_KEY as string;

const razorpayInstance = new Razorpay({
  key_id: RAZORPAY_KEY_ID,
  key_secret: RAZORPAY_SECRET_KEY
})

const router = express.Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: false}))


router.get("/search", async (req: Request, res: Response) => {
  try {
    const query = constructSearchQuery(req.query);

    let sortOptions = {};

    switch (req.query.sortOption) {
      case "starRating":
        sortOptions = { starRating: -1 };
        break;
      case "pricePerNight":
        sortOptions = { pricePerNight: 1 };
        break;
      case "pricePerNightDesc":
        sortOptions = { pricePerNight: -1 };
        break;
    }

    const pageSize = 5;
    const pageNumber = parseInt(
      req.query.page ? req.query.page.toString() : "1"
    );
    const skip = (pageNumber - 1) * pageSize;

    const hotels = await Hotel.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(pageSize);

    const total = await Hotel.countDocuments();

    const response: HotelSearchResponse = {
      data: hotels,
      pagination: {
        total,
        page: pageNumber,
        pages: Math.ceil(total / pageSize),
      },
    };

    res.json(response);
  } catch (error) {
    console.log("error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

router.get("/", async (req: Request, res: Response) =>{
  try {
    const hotels = await Hotel.find().sort("-lastUpdated");
    res.json(hotels);
  } catch (error) {
    console.log(error)
    res.status(500).json({message: "Error fetching hotels"})
  }
} )

router.get(
  "/:id",
  [param("id").notEmpty().withMessage("Hotel Id is required")],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const id = req.params.id.toString();

    try {
      const hotel = await Hotel.findById(id);
      res.json(hotel);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error fetching hotels" });
    }
  }
);

router.post(
  "/:hotelId/bookings/payment-intent",
  verifyToken,
  async (req: Request, res: Response) => {
    const { numberOfNights } = req.body;
    const hotelId = req.params.hotelId;

    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(400).json({ message: "Hotel not found" });
    }

    const totalCost = hotel.pricePerNight * numberOfNights;

    if(totalCost <= 0) {
      return res.status(400).json({message: "Invalid total cost"})
    }

    try {
      const order = await razorpayInstance.orders.create({
        amount: totalCost * 100,
        currency: "inr",
        receipt: hotel._id.toString()
      })

      const clientSecret = order?.id;

      if(!clientSecret){
        return res.status(500).json({ message: "Error creating payment intent"})
      }

      const response = {
        paymentIntendId:order?.id,
        clientSecret,
        totalCost
      }

      res.send(response)

      
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error creating payment intent" });
    }

  }
);

router.post(
  "/:hotelId/bookings",
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      const paymentIntentId = req.body.paymentIntentId;
      const { numberOfNights } = req.body;

      const order = await razorpayInstance.orders.fetch(paymentIntentId);

      if(!order){
        return res.status(400).json({message: "Order not fount"})
      }

      const hotelId = req.params.hotelId;

      const hotel = await Hotel.findById(hotelId);

      if(!hotel){
        return res.status(400).json({message: "Hotel not found"})
      }

      const totalCost = hotel.pricePerNight * numberOfNights;

      if(order.status !== "paid"){
        return res.status(400).json({message: `Payment not successful. Order Status: ${order.status}`})
      }

      const newBooking: BookingType ={
        ...req.body,
        userId: req.userId,
      }

      const updateHotel = await Hotel.findOneAndUpdate({_id: req.params.hotelId}, {
        $push: {bookings: newBooking}
      }, {new: true})

      if(!updateHotel){
        return res.status(400).json({message: "Hotel not found"})
      }

      await updateHotel.save();
      res.status(200).json({message: "Booking successful"})
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Something went wrong" });
    }
  }
);

const constructSearchQuery = (queryParams: any) => {
  let constructQuery: any = {};
  if (queryParams.destination) {
    constructQuery.$or = [
      { city: new RegExp(queryParams.destination, "i") },
      { country: new RegExp(queryParams.destination, "i") },
    ];
  }

  if (queryParams.adultCount) {
    constructQuery.adultCount = {
      $gte: parseInt(queryParams.adultCount),
    };
  }

  if (queryParams.childCount) {
    constructQuery.childCount = {
      $gte: parseInt(queryParams.childCount),
    };
  }

  if (queryParams.facilities) {
    constructQuery.facilities = {
      $all: Array.isArray(queryParams.facilities)
        ? queryParams.facilities
        : [queryParams.facilities],
    };
  }

  if (queryParams.types) {
    constructQuery.type = {
      $in: Array.isArray(queryParams.types)
        ? queryParams.types
        : [queryParams.types],
    };
  }

  if (queryParams.stars) {
    const starRating = parseInt(queryParams.stars).toString();

    constructQuery.starRating = { $in: starRating };
  }

  if (queryParams.maxPrice) {
    constructQuery.pricePerNight = {
      $lte: parseInt(queryParams.maxPrice),
    };
  }

  return constructQuery;
};

export default router;
