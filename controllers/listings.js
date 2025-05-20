const Listing = require("../models/listing");

module.exports.index = async (req, res, next) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res, next) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({path: "reviews", populate: {path: "author"},}).populate("owner");
    if(!listing) {
        req.flash("error","Listing you requested for does not exist!");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", {listing});
};

module.exports.createListing = async(req, res, next) => {
    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url, filename};
    await newListing.save(); 
    req.flash("success", "New Listing Created!"); 
    res.redirect("/listings");
};

module.exports.renderEditForm = async(req, res, next) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing) {
        req.flash("error","Listing you requested for does not exist!");
        res.redirect("/listings");
    }

    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_300,w_250")
    res.render("listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.updateListing = async (req, res, next) => {
  
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});

    if(typeof req.file !== "undefined") {
      let url = req.file.path;
      let filename = req.file.filename;
      listing.image = { url, filename };
      await listing.save();
    }
   

    req.flash("success","Listing Updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res, next) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");                                                                                                                                                                                                                                                                                                                                                                        
};

module.exports.search = async (req, res) => {
    try {
        // Extract and trim the search query
        const input = req.query.q.trim();
       // console.log("Received Query:", input); // Debug: Check the received query

        if (!input) {
            req.flash("error", "Search value cannot be empty!");
            return res.redirect("/listings");
        }

        // Capitalize the first letter of each word
        const formattedInput = input
            .split(" ")
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(" ");
       // console.log("Formatted Query:", formattedInput); // Debug: Check the formatted query

        // Search by title
        const allListing = await Listing.find({
            title: { $regex: formattedInput, $options: "i" } // Case-insensitive search
        }).sort({ _id: -1 });
       // console.log("Listings Found:", allListing); // Debug: Check if listings are returned

        if (allListing.length === 0) {
            req.flash("error", "No listings found with the given title!");
            return res.redirect("/listings");
        }

        res.locals.success = "Listings found";
        res.render("listings/index.ejs", { allListings: allListing });
    } catch (error) {
        console.error("Search Error:", error); // Debug: Check for any errors
        req.flash("error", "An error occurred while searching!");
        res.redirect("/listings");
    }
};