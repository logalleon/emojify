import { Router } from "express";
import Emojify from "./Controllers/Emojify";

const init = (): Router => {

  const router: Router = Router();
  router.get('/status', (req, res) => res.sendStatus(200));
  const emojify = new Emojify();
  router.post('/emojify', emojify.handle.bind(emojify));
  router.get('/auth', emojify.auth.bind(emojify));
  router.get('/splash', (req, res) => { res.sendFile(`${__dirname}/www/index.html`)});
  router.get('/help.jpg', (req, res) => { res.sendFile(`${__dirname}/www/help.jpg`)});
  return router;

}

export default init;