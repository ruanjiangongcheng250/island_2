const { sequelize } = require('../../core/db');
const { Sequelize, Model, Op} = require('sequelize');
const { Favor } = require('@models/favor')

class HotBook extends Model {
    static async getAll(){
        const books =await HotBook.findAll({
            order: ['index']
        })
        const ids = []
        books.forEach(book => {
            ids.push(book.id)
        });
        const favors =await Favor.findAll({
            where:{
                art_id:{
                    [Op.in]:ids,
                },
                type:400
            },
            group:['art_id'],
            attributes:['art_id', [Sequelize.fn('COUNT','*'),'count']]
        })
        books.forEach(book=>{
            HotBook._getEachBookStatus(book, favors)
        })
        return books
    }

    static _getEachBookStatus (book, favors) {
        let count = 0;
        favors.forEach(favor=>{
            if(book.id === favor.art_id){
                count = favor.get('count')
            }
        })
        book.setDataValue('fav_nums', count);
        return book;
    }
}

HotBook.init({
    index: Sequelize.INTEGER,
    author: Sequelize.STRING,
    image: Sequelize.STRING,
    title: Sequelize.STRING
}, {
    sequelize,
    tableName: 'hot_book'
})
module.exports = {
    HotBook
}