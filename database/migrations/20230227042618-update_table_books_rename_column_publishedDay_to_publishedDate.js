
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.renameColumn('books', 'publishedDay', 'publishedDate');
  },

  async down(queryInterface, Sequelize) {
    // return queryInterface.renameColumn('books', 'publishedDate', 'publishedDay');
  },
};
