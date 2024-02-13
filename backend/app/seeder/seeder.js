const UserSeeder = require('./user')
const seed = () => {
    UserSeeder().then(r => { console.log("UserSeeder has been executed successfully!") })
}
seed();