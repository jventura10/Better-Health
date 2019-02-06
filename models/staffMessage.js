var uuidv1 = require("uuid/v1");

module.exports = function(sequelize,DataTypes){
    var Message = sequelize.define("Message",{
        title:{
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1,100]
            }
        },
        body: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                len: [1]
            }
        },
        receiver: {
            type: DataTypes.UUID
        }
    });

    Message.associate = function(models){
        Message.belongsTo(models.Patient,{
            foreignKey: {
                allowNull: false
            }
        });
    }

    return Message;
}