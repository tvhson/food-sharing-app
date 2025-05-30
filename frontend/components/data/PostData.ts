const PostData = [
  {
    id: '1',
    title: 'First Item',
    imageUrl:
      'https://hips.hearstapps.com/hmg-prod/images/apples-at-farmers-market-royalty-free-image-1627321463.jpg?crop=0.796xw:1.00xh;0.103xw,0&resize=640:*',
    description: 'This is the first item',
    createdDate: '2021-09-01',
    locationName: 'Ho Chi Minh City',
    latitude: 10.875830080525523,
    longitude: 106.78383111914486,
    linkWebsites: 'https://www.google.com',
    userId: 2,
  },
  {
    id: '2',
    title: 'Second Item',
    imageUrl:
      'https://hips.hearstapps.com/hmg-prod/images/apples-at-farmers-market-royalty-free-image-1627321463.jpg?crop=0.796xw:1.00xh;0.103xw,0&resize=640:*',
    description: 'This is the second item',
    createdDate: '2021-09-02',
    locationName: 'Ho Chi Minh City',
    latitude: 10.875830080525523,
    longitude: 106.78383111914486,
    linkWebsites: 'https://www.google.com',
    userId: 2,
  },
  {
    id: '3',
    title: 'Third Item',
    imageUrl:
      'https://hips.hearstapps.com/hmg-prod/images/apples-at-farmers-market-royalty-free-image-1627321463.jpg?crop=0.796xw:1.00xh;0.103xw,0&resize=640:*',
    description: 'This is the third item',
    createdDate: '2021-09-03',
    locationName: 'Ho Chi Minh City',
    latitude: 10.875830080525523,
    longitude: 106.78383111914486,
    linkWebsites: 'https://www.google.com',
    userId: 2,
  },
  {
    id: '4',
    title: 'Fourth Item',
    imageUrl:
      'https://hips.hearstapps.com/hmg-prod/images/apples-at-farmers-market-royalty-free-image-1627321463.jpg?crop=0.796xw:1.00xh;0.103xw,0&resize=640:*',
    description: 'This is the fourth item',
    createdDate: '2021-09-04',
    locationName: 'Ho Chi Minh City',
    latitude: 10.875830080525523,
    longitude: 106.78383111914486,
    linkWebsites: 'https://www.google.com',
    userId: 2,
  },
  {
    id: '5',
    title: 'Fifth Item',
    imageUrl:
      'https://hips.hearstapps.com/hmg-prod/images/apples-at-farmers-market-royalty-free-image-1627321463.jpg?crop=0.796xw:1.00xh;0.103xw,0&resize=640:*',
    description: 'This is the fifth item',
    createdDate: '2021-09-05',
    locationName: 'Ho Chi Minh City',
    latitude: 10.875830080525523,
    longitude: 106.78383111914486,
    linkWebsites: 'https://www.google.com',
    userId: 2,
  },
  {
    id: '6',
    title: 'Sixth Item',
    imageUrl:
      'https://hips.hearstapps.com/hmg-prod/images/apples-at-farmers-market-royalty-free-image-1627321463.jpg?crop=0.796xw:1.00xh;0.103xw,0&resize=640:*',
    description: 'This is the sixth item',
    createdDate: '2021-09-06',
    locationName: 'Ho Chi Minh City',
    latitude: 10.875830080525523,
    longitude: 106.78383111914486,
    linkWebsites: 'https://www.google.com',
    userId: 2,
  },
  {
    id: '7',
    title: 'Seventh Item',
    imageUrl:
      'https://hips.hearstapps.com/hmg-prod/images/apples-at-farmers-market-royalty-free-image-1627321463.jpg?crop=0.796xw:1.00xh;0.103xw,0&resize=640:*',
    description: 'This is the seventh item',
    createdDate: '2021-09-07',
    locationName: 'Ho Chi Minh City',
    latitude: 10.875830080525523,
    longitude: 106.78383111914486,
    linkWebsites: 'https://www.google.com',
    userId: 2,
  },
  {
    id: '8',
    title: 'Eighth Item',
    imageUrl:
      'https://hips.hearstapps.com/hmg-prod/images/apples-at-farmers-market-royalty-free-image-1627321463.jpg?crop=0.796xw:1.00xh;0.103xw,0&resize=640:*',
    description: 'This is the eighth item',
    createdDate: '2021-09-08',
    locationName: 'Ho Chi Minh City',
    latitude: 10.875830080525523,
    longitude: 106.78383111914486,
    linkWebsites: 'https://www.google.com',
    userId: 2,
  },
];
export default PostData;

export const notificationItems = [
  {
    id: '1',
    title: 'Food Donation Request',
    imageUrl: 'https://www.example.com/sample-image1.png',
    description: 'You have a new food donation request!',
    type: 'RECEIVED',
    createdDate: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    linkId: '12345',
    userId: 'user1',
    senderId: 'sender1',
  },
  {
    id: '2',
    title: 'Message from a Friend',
    imageUrl: 'https://www.example.com/sample-image2.png',
    description: 'Your friend has sent you a message.',
    type: 'MESSAGE',
    createdDate: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
    linkId: '54321',
    userId: 'user2',
    senderId: 'sender2',
  },
  {
    id: '3',
    title: 'Food Pickup Reminder',
    imageUrl: 'https://www.example.com/sample-image3.png',
    description: 'Reminder: You have a food pickup scheduled.',
    type: 'RECEIVED',
    createdDate: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    linkId: '67890',
    userId: 'user3',
    senderId: 'sender3',
  },
  {
    id: '4',
    title: 'Event Invitation',
    imageUrl: 'https://www.example.com/sample-image4.png',
    description: 'You are invited to a community event!',
    type: 'MESSAGE',
    createdDate: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    linkId: '98765',
    userId: 'user4',
    senderId: 'sender4',
  },
  {
    id: '5',
    title: 'Food Donation Accepted',
    imageUrl: 'https://www.example.com/sample-image5.png',
    description: 'Your food donation has been accepted!',
    type: 'RECEIVED',
    createdDate: new Date(Date.now() - 604800000).toISOString(), // 1 week ago
    linkId: '24680',
    userId: 'user5',
    senderId: 'sender5',
  },
];

export const rewardItems = [
  {
    id: 1,
    rewardName: 'Áo',
    rewardDescription: 'Đẹp',
    imageUrl:
      'https://hips.hearstapps.com/hmg-prod/images/apples-at-farmers-market-royalty-free-image-1627321463.jpg?crop=0.796xw:1.00xh;0.103xw,0&resize=640:*',
    pointsRequired: 1,
    stockQuantity: 10,
    createdDate: new Date(),
  },
  {
    id: 2,
    rewardName: 'Áo',
    rewardDescription: 'Đẹp',
    imageUrl:
      'https://hips.hearstapps.com/hmg-prod/images/apples-at-farmers-market-royalty-free-image-1627321463.jpg?crop=0.796xw:1.00xh;0.103xw,0&resize=640:*',

    pointsRequired: 1,
    stockQuantity: 10,
    createdDate: new Date(),
  },
  {
    id: 3,
    rewardName: 'Áo',
    rewardDescription: 'Đẹp',
    imageUrl:
      'https://hips.hearstapps.com/hmg-prod/images/apples-at-farmers-market-royalty-free-image-1627321463.jpg?crop=0.796xw:1.00xh;0.103xw,0&resize=640:*',
    pointsRequired: 1,
    stockQuantity: 10,
    createdDate: new Date(),
  },
  {
    id: 4,
    rewardName: 'Áo',
    rewardDescription: 'Đẹp',
    imageUrl:
      'https://hips.hearstapps.com/hmg-prod/images/apples-at-farmers-market-royalty-free-image-1627321463.jpg?crop=0.796xw:1.00xh;0.103xw,0&resize=640:*',
    pointsRequired: 1,
    stockQuantity: 10,
    createdDate: new Date(),
  },
  {
    id: 5,
    rewardName: 'Áo',
    rewardDescription: 'Đẹp',
    imageUrl:
      'https://hips.hearstapps.com/hmg-prod/images/apples-at-farmers-market-royalty-free-image-1627321463.jpg?crop=0.796xw:1.00xh;0.103xw,0&resize=640:*',
    pointsRequired: 1,
    stockQuantity: 10,
    createdDate: new Date(),
  },
  {
    id: 6,
    rewardName: 'Áo',
    rewardDescription: 'Đẹp',
    imageUrl:
      'https://hips.hearstapps.com/hmg-prod/images/apples-at-farmers-market-royalty-free-image-1627321463.jpg?crop=0.796xw:1.00xh;0.103xw,0&resize=640:*',
    pointsRequired: 1,
    stockQuantity: 10,
    createdDate: new Date(),
  },
  {
    id: 7,
    rewardName: 'Áo',
    rewardDescription: 'Đẹp',
    imageUrl:
      'https://hips.hearstapps.com/hmg-prod/images/apples-at-farmers-market-royalty-free-image-1627321463.jpg?crop=0.796xw:1.00xh;0.103xw,0&resize=640:*',
    pointsRequired: 1,
    stockQuantity: 10,
    createdDate: new Date(),
  },
];

export const historyExchangeItems = [
  {
    id: 1,
    accountId: 1,
    rewardDetail: {
      rewardName: 'Áo',
      rewardDescription: 'Đẹp',
      imageUrl:
        'https://hips.hearstapps.com/hmg-prod/images/apples-at-farmers-market-royalty-free-image-1627321463.jpg?crop=0.796xw:1.00xh;0.103xw,0&resize=640:*',
    },
    pointsUsed: 2,
    quantity: 8,
    createdDate: '2025-01-06T14:54:35.136+00:00',
    status: 'PENDING',
    location: 'Ho Chi Minh City',
    phone: '0123456789',
  },
  {
    id: 2,
    accountId: 1,
    rewardDetail: {
      rewardName: 'Áo',
      rewardDescription: 'Đẹp',
      imageUrl:
        'https://hips.hearstapps.com/hmg-prod/images/apples-at-farmers-market-royalty-free-image-1627321463.jpg?crop=0.796xw:1.00xh;0.103xw,0&resize=640:*',
    },
    pointsUsed: 2,
    quantity: 8,
    createdDate: '2025-01-06T14:54:35.136+00:00',
    status: 'PENDING',
    location: 'Ho Chi Minh City',
    phone: '0123456789',
  },
  {
    id: 3,
    accountId: 1,
    rewardDetail: {
      rewardName: 'Áo',
      rewardDescription: 'Đẹp',
      imageUrl:
        'https://hips.hearstapps.com/hmg-prod/images/apples-at-farmers-market-royalty-free-image-1627321463.jpg?crop=0.796xw:1.00xh;0.103xw,0&resize=640:*',
    },
    pointsUsed: 2,
    quantity: 8,
    createdDate: '2025-01-06T14:54:35.136+00:00',
    status: 'PENDING',
    location: 'Ho Chi Minh City',
    phone: '0123456789',
  },
  {
    id: 4,
    accountId: 1,
    rewardDetail: {
      rewardName: 'Áo',
      rewardDescription: 'Đẹp',
      imageUrl:
        'https://hips.hearstapps.com/hmg-prod/images/apples-at-farmers-market-royalty-free-image-1627321463.jpg?crop=0.796xw:1.00xh;0.103xw,0&resize=640:*',
    },
    pointsUsed: 2,
    quantity: 8,
    createdDate: '2025-01-06T14:54:35.136+00:00',
    status: 'PENDING',
    location: 'Ho Chi Minh City',
    phone: '0123456789',
  },
  {
    id: 5,
    accountId: 1,
    rewardDetail: {
      rewardName: 'Áo',
      rewardDescription: 'Đẹp',
      imageUrl:
        'https://hips.hearstapps.com/hmg-prod/images/apples-at-farmers-market-royalty-free-image-1627321463.jpg?crop=0.796xw:1.00xh;0.103xw,0&resize=640:*',
    },
    pointsUsed: 2,
    quantity: 8,
    createdDate: '2025-01-06T14:54:35.136+00:00',
    status: 'PENDING',
    location: 'Ho Chi Minh City',
    phone: '0123456789',
  },
  {
    id: 6,
    accountId: 1,
    rewardDetail: {
      rewardName: 'Áo',
      rewardDescription: 'Đẹp',
      imageUrl:
        'https://hips.hearstapps.com/hmg-prod/images/apples-at-farmers-market-royalty-free-image-1627321463.jpg?crop=0.796xw:1.00xh;0.103xw,0&resize=640:*',
    },
    pointsUsed: 2,
    quantity: 8,
    createdDate: '2025-01-06T14:54:35.136+00:00',
    status: 'PENDING',
    location: 'Ho Chi Minh City',
    phone: '0123456789',
  },
];
