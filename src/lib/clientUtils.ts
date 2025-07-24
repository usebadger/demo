// Random data generators
const firstNames = [
  "Alex",
  "Jordan",
  "Casey",
  "Riley",
  "Taylor",
  "Morgan",
  "Quinn",
  "Avery",
  "Blake",
  "Dakota",
  "Emery",
  "Finley",
  "Gray",
  "Harper",
  "Indigo",
  "Jules",
  "Kai",
  "Lane",
  "Mika",
  "Nova",
  "Ocean",
  "Parker",
  "Quincy",
  "River",
  "Sage",
  "Tatum",
  "Uma",
  "Vale",
  "Wren",
  "Xander",
  "Yuki",
  "Zara",
];

const lastNames = [
  "Anderson",
  "Brown",
  "Clark",
  "Davis",
  "Evans",
  "Fisher",
  "Garcia",
  "Harris",
  "Jackson",
  "King",
  "Lee",
  "Miller",
  "Nelson",
  "Owen",
  "Parker",
  "Quinn",
  "Roberts",
  "Smith",
  "Taylor",
  "Underwood",
  "Vargas",
  "Wilson",
  "Young",
  "Zhang",
];

const cities = [
  "New York",
  "Los Angeles",
  "Chicago",
  "Houston",
  "Phoenix",
  "Philadelphia",
  "San Antonio",
  "San Diego",
  "Dallas",
  "San Jose",
  "Austin",
  "Jacksonville",
  "Fort Worth",
  "Columbus",
  "Charlotte",
  "San Francisco",
  "Indianapolis",
  "Seattle",
  "Denver",
  "Washington",
  "Boston",
  "El Paso",
  "Nashville",
  "Detroit",
];

const streetNames = [
  "Main Street",
  "Oak Avenue",
  "Maple Drive",
  "Cedar Lane",
  "Pine Road",
  "Elm Street",
  "Washington Blvd",
  "Park Avenue",
  "Broadway",
  "5th Avenue",
  "Sunset Boulevard",
  "Hollywood Blvd",
  "Michigan Avenue",
  "Peachtree Street",
  "Bourbon Street",
  "Beale Street",
  "Lombard Street",
  "Wall Street",
  "Rodeo Drive",
];

const streetTypes = [
  "Street",
  "Avenue",
  "Drive",
  "Lane",
  "Road",
  "Boulevard",
  "Court",
  "Place",
  "Way",
];

export interface UserData {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  address: {
    street: string;
    city: string;
    zipCode: string;
  };
  memberSince: string;
}

function generateRandomUserId(): string {
  return "user_" + Math.random().toString(36).substr(2, 9);
}

function generateRandomName(): { firstName: string; lastName: string } {
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  return { firstName, lastName };
}

function generateRandomEmail(firstName: string, lastName: string): string {
  const domains = [
    "example.com",
    "demo.net",
    "test.org",
    "sample.co",
    "fake.email",
  ];
  const domain = domains[Math.floor(Math.random() * domains.length)];
  const randomNum = Math.floor(Math.random() * 999);
  return `${firstName.toLowerCase()}.${lastName.toLowerCase()}${randomNum}@${domain}`;
}

function generateRandomAddress(): {
  street: string;
  city: string;
  zipCode: string;
} {
  const streetName =
    streetNames[Math.floor(Math.random() * streetNames.length)];
  const streetType =
    streetTypes[Math.floor(Math.random() * streetTypes.length)];
  const streetNumber = Math.floor(Math.random() * 9999) + 1;
  const apartment = Math.floor(Math.random() * 999) + 1;
  const city = cities[Math.floor(Math.random() * cities.length)];
  const zipCode = Math.floor(Math.random() * 90000) + 10000;

  return {
    street: `${streetNumber} ${streetName} ${streetType}, Apt ${apartment}`,
    city,
    zipCode: zipCode.toString(),
  };
}

function generateRandomMemberSince(): string {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const month = months[Math.floor(Math.random() * months.length)];
  const year = Math.floor(Math.random() * 3) + 2022; // Random year between 2022-2024
  return `${month} ${year}`;
}

export function generateRandomUserData(): UserData {
  const userId = generateRandomUserId();
  const { firstName, lastName } = generateRandomName();
  const email = generateRandomEmail(firstName, lastName);
  const address = generateRandomAddress();
  const memberSince = generateRandomMemberSince();

  return {
    userId,
    firstName,
    lastName,
    email,
    address,
    memberSince,
  };
}

// Client-side cookie utilities
export function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
}

export function setCookie(
  name: string,
  value: string,
  days: number = 365
): void {
  if (typeof document === "undefined") return;

  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;samesite=lax`;
}

export function getUserDataFromCookie(): UserData | null {
  try {
    const userDataCookie = getCookie("userData");
    if (userDataCookie) {
      return JSON.parse(decodeURIComponent(userDataCookie));
    }
    return null;
  } catch (error) {
    console.error("Error reading user data from cookie:", error);
    return null;
  }
}

export function setUserDataCookie(userData: UserData): void {
  try {
    const encodedValue = encodeURIComponent(JSON.stringify(userData));
    setCookie("userData", encodedValue, 365);
  } catch (error) {
    console.error("Error setting user data cookie:", error);
  }
}

export function clearUserDataCookie(): void {
  try {
    // Set cookie with past expiration date to clear it
    const expires = new Date();
    expires.setTime(expires.getTime() - 24 * 60 * 60 * 1000); // 1 day in the past
    document.cookie = `userData=;expires=${expires.toUTCString()};path=/;samesite=lax`;
  } catch (error) {
    console.error("Error clearing user data cookie:", error);
  }
}

// Cart utilities
export function getCartFromCookie(): number[] {
  try {
    const cartCookie = getCookie("cart");
    if (cartCookie) {
      return JSON.parse(decodeURIComponent(cartCookie));
    }
    return [];
  } catch (error) {
    console.error("Error reading cart from cookie:", error);
    return [];
  }
}

export function setCartCookie(cart: number[]): void {
  try {
    const encodedValue = encodeURIComponent(JSON.stringify(cart));
    setCookie("cart", encodedValue, 365);
  } catch (error) {
    console.error("Error setting cart cookie:", error);
  }
}

// Order history utilities
export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  userId: string;
  date: string;
  total: number;
  status: string;
  items: OrderItem[];
}

export function getOrderHistoryFromCookie(): Order[] {
  try {
    const orderHistoryCookie = getCookie("orderHistory");
    if (orderHistoryCookie) {
      return JSON.parse(decodeURIComponent(orderHistoryCookie));
    }
    return [];
  } catch (error) {
    console.error("Error reading order history from cookie:", error);
    return [];
  }
}

export function addOrderToHistory(order: Order): void {
  try {
    const existingOrders = getOrderHistoryFromCookie();
    const updatedOrders = [order, ...existingOrders]; // Add new order to the beginning
    const encodedValue = encodeURIComponent(JSON.stringify(updatedOrders));
    setCookie("orderHistory", encodedValue, 365);
  } catch (error) {
    console.error("Error adding order to history:", error);
  }
}
