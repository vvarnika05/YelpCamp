if (campground.geometry && campground.geometry.coordinates.length === 2) {
maptilersdk.config.apiKey = maptilerApiKey;
//console.log("Campground Geometry:", campground.geometry);

const map = new maptilersdk.Map({
    container: 'map',
    style: maptilersdk.MapStyle.BRIGHT,
    center: campground.geometry.coordinates, // starting position [lng, lat]
    zoom: 8 // starting zoom
});

new maptilersdk.Marker()
    .setLngLat(campground.geometry.coordinates)
    .setPopup(
        new maptilersdk.Popup({ offset: 25 })
            .setHTML(
                `<h3>${campground.title}</h3><p>${campground.location}</p>`
            )
    )
    .addTo(map)
} else {
    console.warn("❗ No coordinates available for this campground:", campground.title);
}