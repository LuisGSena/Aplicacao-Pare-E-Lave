const {Sequelize, DataTypes} = require("sequelize");

const sequelize = new Sequelize("todolist2", "root", "", {
    host: "localhost",
    dialect: "mysql"
});

const Tarefas = sequelize.define("tarefas", {
    name: {
        type: DataTypes.STRING(100),

    },
    email: {
        type: DataTypes.STRING(100)
    },
    password: {
        type: DataTypes.INTEGER
    }
}, {timestamps: false});

Tarefas.sync()
    .then(()=> {
        console.log("Tabela tarefa sincronizada com sucesso!");
    });

module.exports = Tarefas;