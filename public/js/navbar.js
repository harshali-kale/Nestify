// bar button click then display sign up login or airbnb button
const imgBar = document.querySelector("#png-img-bar");
const crossBar = document.querySelector("#png-img-cross");
const userFnx = document.querySelector(".user-fnx");
const userButton = document.querySelector(".nav-user");
userButton.addEventListener("click", () => {
	if (userFnx.style.display == "none") {
		userFnx.style.display = "flex";
		imgBar.style.display = "none";
		crossBar.style.display = "inline";
	} else {
		userFnx.style.display = "none";
		crossBar.style.display = "none";
		imgBar.style.display = "inline";
	}
});