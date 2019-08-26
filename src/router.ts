import { Router } from "express";
import Emojify from "./Controllers/Emojify";

const init = (): Router => {

  const router: Router = Router();
  router.get('/status', (req, res) => res.sendStatus(200));
  const emojify = new Emojify();
  router.post('/emojify', emojify.handle.bind(emojify));
  return router;

}

export default init;