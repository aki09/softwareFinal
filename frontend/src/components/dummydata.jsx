export const drones = [
  {
    id: 1,
    type: "cleaning",
    battery: 90,
    takeoffStatus: true,
    serial: "D001",
    location: {
      lat: 37.7749,
      lon: -122.4194,
    },
    videoStreamStatus: false,
    streamURL: '',
    errors: [
      {
        errorId: 2355,
      },
    ],
  },
  {
    id: 2,
    type: "inspection",
    battery: 15,
    takeoffStatus: true,
    serial: "D002",
    location: {
      lat: 40.7128,
      lon: -74.006,
    },
    videoStreamStatus: false,
    streamURL: '',
    errors: [
      {
        errorId: 4367,
      },
    ],
  },
  {
    id: 3,
    type: "cleaning",
    battery: 60,
    takeoffStatus: true,
    serial: "D003",
    location: {
      lat: 51.5074,
      lon: -0.1278,
    },
    streamURL: '',
    errors: [
      {
        errorId: 6722,
      },
    ],
  },
];

export const user = {
  companyName: "Acme Inc.",
  userName: "Jane Doe",
  drone_id: 1,
  password: "secret",
};
