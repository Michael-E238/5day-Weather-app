import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
// Define a City class with name and id properties
class City {
  name: string;
  id: string;
  constructor(name: string, id: string) {
    this.name = name;
    this.id = id;
  }
}
// Complete the HistoryService class
class HistoryService {
  private static filePath = 'searchHistory.json';
  // Define a read method that reads from the searchHistory.json file
  private async read(): Promise<City[]> {
    try {
      const data = await fs.promises.readFile(HistoryService.filePath, 'utf8');
      return JSON.parse(data) as City[];
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        return [];
      }
      throw error;
    }
  }
  // Define a write method that writes the updated cities array to the searchHistory.json file
  private async write(cities: City[]): Promise<void> {
    await fs.promises.writeFile(
      HistoryService.filePath,
      JSON.stringify(cities, null, 2)
    );
  }
  // Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  async getCities(): Promise<City[]> {
    return await this.read();
  }
  // Define an addCity method that adds a city to the searchHistory.json file
  async addCity(name: string): Promise<void> {
    const cities = await this.read();
    const newCity = new City(name, uuidv4());
    cities.push(newCity);
    await this.write(cities);
  }
  // BONUS: Define a removeCity method that removes a city from the searchHistory.json file
  async removeCity(id: string): Promise<void> {
    const cities = await this.read();
    const updatedCities = cities.filter((city) => city.id !== id);
    await this.write(updatedCities);
  }
}
export default new HistoryService();