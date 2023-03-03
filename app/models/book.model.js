// third party components
const Sequelize = require('sequelize');
// const validator = require('validator');
// our components
// const config = require('../configs/general.config');
const constant = require('../utils/constant.utils');

module.exports = (database, DataTypes) => {
  class Book extends Sequelize.Model {
    // initiate associate with other models (automatically called in ../models/index.js)
    static associate(models) {
      models.Book.belongsToMany(models.Category, {
        through: models.CategoryBook,
        as: 'categories',
      });
    }

    // allow attributes for search
    static getAttributesForSearch() {
      return ['name', 'authors'];
    }

    // allow attributes for sort
    static getAttributesForSort() {
      return ['name', 'isbn', 'authors', 'publishedDay', 'activated', 'createdAt'];
    }

    // allow attributes for filter
    static getAttributesForFilter() {
      return ['name', 'authors', 'publishedDay', 'activated', 'deleted', 'createdAt'];
    }
  }

  Book.init({
    id: {
      type: Sequelize.DataTypes.BIGINT,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    isbn: {
      type: Sequelize.DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        notNull: {
          msg: 'isbn must be not null',
        },
        len: {
          args: [1, 50],
          msg: 'isbn must be not empty and less than 50 characters',
        },
      },
    },
    name: {
      type: Sequelize.DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notNull: {
          msg: 'name must be not null',
        },
        len: {
          args: [1, 255],
          msg: 'name must be not empty and less than 255 characters',
        },
      },
    },
    price: {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    pageCount: {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'page count must be not null',
        },
        min: 1,
        max: 10000,
      },
    },
    authors: {
      type: Sequelize.DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notNull: {
          msg: 'authors must be not null',
        },
        len: {
          args: [0, 255],
          msg: 'authors must be not empty and less than 255 characters',
        },
      },
    },
    publishedDate: {
      type: Sequelize.DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: 'published date must be not null',
        },
        isDate: {
          args: true,
          msg: 'published date must be a date string',
        },
      },
    },
    series: {
      type: Sequelize.DataTypes.STRING(500),
      allowNull: true,
      validate: {
        len: {
          args: [0, 500],
          msg: 'series must be less than 500 characters',
        },
      },
    },
    thumbnail: {
      type: Sequelize.DataTypes.TEXT,
      allowNull: true,
    },
    image1: {
      type: Sequelize.DataTypes.TEXT,
      allowNull: true,
    },
    image2: {
      type: Sequelize.DataTypes.TEXT,
      allowNull: true,
    },
    image3: {
      type: Sequelize.DataTypes.TEXT,
      allowNull: true,
    },
    image4: {
      type: Sequelize.DataTypes.TEXT,
      allowNull: true,
    },
    description: {
      type: Sequelize.DataTypes.TEXT,
      allowNull: true,
    },
    activated: {
      type: Sequelize.DataTypes.BOOLEAN,
      defaultValue: constant.BOOLEAN_ENUM.TRUE,
    },
    deleted: {
      type: Sequelize.DataTypes.BOOLEAN,
      defaultValue: constant.BOOLEAN_ENUM.FALSE,
    },
    createdBy: {
      type: Sequelize.DataTypes.BIGINT,
      allowNull: true,
    },
    updatedBy: {
      type: Sequelize.DataTypes.BIGINT,
      allowNull: true,
    },
    deletedBy: {
      type: Sequelize.DataTypes.BIGINT,
      allowNull: true,
    },
    createdAt: {
      type: Sequelize.DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.NOW,
    },
    updatedAt: {
      type: Sequelize.DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.NOW,
    },
    deletedAt: {
      type: Sequelize.DataTypes.DATE,
      allowNull: true,
    },
  }, {
    sequelize: database,
    tableName: 'books',
    validate: {
      // categorieIds(next) {
      //   if(!this.categorieIds){
      //     throw new Error('categorieIds must be not null');
      //   }
      //   if(!validator.isJSON(this.categories)){
      //     throw new Error('categorieIds must be a list category ids');
      //   }
      //   try {
      //     const ids = JSON.parse(this.categorieIds);
      //     const { Category } = require('./index');
      //     Category.findAll({
      //       where: { id: { [Sequelize.Op.in]: ids }}
      //     }).then(function(cats){
      //       if(cats.length < ids.length){
      //         throw new Error('categorieIds is incorrect');
      //       } else {
      //         next();
      //       }
      //     }).catch(function(error){
      //       throw error;
      //     })
      //   } catch (error) {
      //     throw new Error('categorieIds must be a list category ids');
      //   }
      // }
    },
  });

  return Book;
};
