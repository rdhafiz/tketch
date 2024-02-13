require("../../config/db");
const UserModel = require('../model/User');
const bcrypt = require("bcrypt");

const UserSeeder = async () => {
    const salt = await bcrypt.genSalt();
    const password = await bcrypt.hash('123asd123', salt);
    const users = [
        {
            avatar: null,
            name: 'Ridwanul Hafiz',
            color: 'bg-green-600',
            email: 'ridwanul.hafiz@gmail.com',
            password: password,
            activation_code: null,
            reset_code:null
        },
        {
            avatar: null,
            name: 'Ahmed Zobayer',
            color: 'bg-emerald-500',
            email: 'zobayer.me@gmail.com',
            password: password,
            activation_code: null,
            reset_code:null
        },
        {
            avatar: null,
            name: 'Khalid Imran',
            color: 'bg-slate-600',
            email: 'ekhalid090@gmail.com',
            password: password,
            activation_code: null,
            reset_code:null
        },
        {
            avatar: null,
            name: 'Abir Das',
            color: 'bg-amber-500',
            email: 'dasabir28@gmail.com',
            password: password,
            activation_code: null,
            reset_code:null
        },
        {
            avatar: null,
            name: 'Ali Haider',
            color: 'bg-fuchsia-500',
            email: 'swccho@gmail.com',
            password: password,
            activation_code: null,
            reset_code:null
        },
        {
            avatar: null,
            name: 'Noyon Ahmed',
            color: 'bg-cyan-500',
            email: 'noyon@gmail.com',
            password: password,
            activation_code: null,
            reset_code:null
        },
        {
            avatar: null,
            name: 'Asadullah Chowdhury',
            color: 'bg-green-600',
            email: 'asadullah@gmail.com',
            password: password,
            activation_code: null,
            reset_code:null
        },
        {
            avatar: null,
            name: 'Mahi Bashar',
            color: 'bg-cyan-500',
            email: 'mahi@gmail.com',
            password: password,
            activation_code: null,
            reset_code:null
        }
    ];
    UserModel.deleteMany().then(() => {
        console.log('User collection has been truncated successfully');

        UserModel.insertMany(users).then(() => {
            console.log('Users has been inserted successfully');
            process.exit(1);
        }).catch((e) => {
            console.log(e.message);
            process.exit(1);
        })

    }).catch((e) => {
        console.log(e.message);
        process.exit(1);
    });
}

module.exports = UserSeeder;