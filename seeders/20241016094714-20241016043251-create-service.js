'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await queryInterface.bulkInsert('Services', [
      {
        name: 'Cat Grooming',
        description: 'Full grooming services',
        price: 120000,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Dog Grooming',
        description: 'Professional grooming for dogs',
        price: 150000,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Dog Walking',
        description: 'Daily walking services for dogs',
        price: 50000,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Cat Daycare',
        description: 'Safe and fun daycare for cats',
        price: 80000,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Dog Daycare',
        description: 'Full day supervision and play for dogs',
        price: 100000,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Pet Massage',
        description: 'Relaxing massage services for pets',
        price: 150000,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Therapeutic Pet Massage',
        description: 'Specialized massage for pain relief',
        price: 180000,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Cat Massage',
        description: 'Gentle massage for relaxing cats',
        price: 120000,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Dog Massage',
        description: 'Soothing massage for your dog',
        price: 130000,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Pet Sitting',
        description: 'In-home pet sitting services',
        price: 200000,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Pet Training',
        description: 'Basic obedience training for pets',
        price: 300000,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Pet Photography',
        description: 'Professional photoshoot for your pet',
        price: 250000,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Pet Health Check',
        description: 'Routine health checkup for pets',
        price: 150000,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Flea and Tick Treatment',
        description: 'Effective flea and tick treatment for pets',
        price: 100000,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Pet Waste Cleanup',
        description: 'Cleaning up after your pet in your yard',
        price: 80000,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
