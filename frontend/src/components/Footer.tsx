const Footer = () => {
    return (
        <div className="bg-blue-800 py-10">
            <div className="container mx-auto flex justify-between items center">
                <span className="text-3xl text-white font-bold tracking-tight">
                    Booking.com
                </span>
                <span className="text-white font-bold tracking-tight flex gap-4">
                    <p className="curser-pointer">Privacy Policy</p>
                    <p className="curser-pointer">Terms of Services</p>
                </span>
            </div>
        </div>
    )
};

export default Footer;