import { Router, type Request, type Response } from 'express';
import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';
const router = Router();
// TODO: POST Request with city name to retrieve weather data
// TODO: GET weather data from city name
  // TODO: save city to search history
router.post('/', async (req: Request, res: Response) => {
  try {
    const { city } = req.body;
    if (!city) {
      return res.status(400).json({ 'error': 'City name is required' });
    }
    const weatherData = await WeatherService.getWeatherForCity(city);
    return res.json(weatherData);
  } catch (error) {
    console.error('Error in retrieving weather data', error);
    return res.status(500).json({ error: 'Error in retrieving weather data' });
  }
});
  router.get('/:city', async (req: Request, res: Response) => {
    try {
      const { city } = req.params;
      if (!city) {
        return res.status(400).json({ error: 'City name is required' });
      }
      const weatherData = await WeatherService.getWeatherForCity(city);
      await HistoryService.addCity(city);
      return res.json(weatherData);
    } catch (error) {
      console.error('Error in retrieving weather data', error);
      return res.status(500).json({ error: 'Error in retrieving weather data' });
    }
  });
// TODO: GET search history
router.get('/history', async (req: Request, res: Response) => {
  try {
    console.log(`${req.method} request received for search history`);
    const history = await HistoryService.getCities();
    res.json(history);
  } catch (error) {
    console.error('Error in retrieving search history', error);
    res.status(500).json({ error: 'Error in retrieving search history' });
  }
});
// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: 'City ID is required' });
    }
    await HistoryService.removeCity(id);
    return res.json({ message: 'City deleted successfully' });
  } catch (error) {
    console.error('Error deleting city from search history:', error);
    return res.status(500).json({ error: 'Failed to delete city from history' });
  }
});
export default router;