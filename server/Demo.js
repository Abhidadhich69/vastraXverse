const User = require("./models/User")

async function Main() {
    console.log("started");
    await User.findOneAndUpdate(
        {
            email: "sharmaabhi720052gmail.com"
        },
        {
            role: "admin"
        }
    )
    console.log("updated");
}


Main();
