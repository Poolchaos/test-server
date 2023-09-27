import express from 'express';
var router = express.Router();
import AuthModel from '../models/auth-model';
// import jwt from 'jsonwebtoken';
import JSEncrypt from 'node-jsencrypt';
import mongoose from 'mongoose';
const ObjectId = mongoose.Types.ObjectId;

const decrypt = function(data) {
  var _decrypt = new JSEncrypt();
  _decrypt.setPrivateKey('MIIEpAIBAAKCAQEAths59StFxNqXNZsi8Zm9cMTF4S4AKqDPvSGIGigwEkPmVT69PwNFIRufgBI9QAimObnQ2WGDfI1bPxWUMqFDvykwA+qq6CH+jI6APYPzXyyWawE6QFo/Z5o6JELuk0ioT8h51VR4oIzhFVaX9qJtaaCD64mk48Pfch57dH7VHr+xi8QlG0vVWSTNCG8BXC7wqv5hlydddvrZvFDaw9UVEGQwyuwiE+sJBVjx3MmjYT/OfGppptSH/rhngtZPLn+6q5sJt1UkzIKExvHgyJ16tPqTsgX2zzslDuPrwQdPKa1YSvyaC3uXFcPY9gOEFyy53Jcb21/3sTig+apBugt5TwIDAQABAoIBAQCrZ9kXsRFMhstIw6sSaTjsieoPV3MErLScOpGWvTjyGEMW/aS3SOaqkQuCSqioOvvq3cF8utI+S/cU28TQGwZfSe9N4HXZZRXpSr/eJvLOJHO4aEFiDRAc/ge31eAldYAnCHXUnFumErRRl14V4TDG+TTyYG55jAYnrhVZw3/qHcA7D3uCRbntRSysQ62gddZLGTPaeeizcXd1VB4YnxOCE51xGgbcYgkmm2E8J0HiDRnmg04Jr/4RpvsBC4vM4OWUGyPVgIfIZwcizizb/fdYPi8sP7vCsc44NLJ9P0PARJ0M1S+mChkdfLQ3nm5+7ORUeHbviY93hVjxJyRh6idBAoGBAO2ALIS/rp/Zg6yq4mbUvmy2iMeL6TjnUzRb1z+mOLbXRsyWaex1bJ7kihVrGOsz+TDyVQIftFBLrcFoF2jwJ7ugzraBcL7yDGYLnVv8eyuiIYuK2mh1/aM1ICsGmQr/LwVKNBQDXDLuftW9vkFofTIGPUYMKZKrV+C+CRtnwoqRAoGBAMRKeZxiFULEKsRpM3xkDNP/SOj4jUmmEH9Xrb3B2SyPDsTGGDeiZCFM538YRXLj9xvil0P3UXRspOMLMGQ2X2xGkG6IIuis+Ta4QPCwkOK05qE8/uKGxKMqzZPIjvsrJcxWEvtU+4vt4AjnbuSvt6jVNePR6o+MVhAHLCllePXfAoGBAJPySUk0gtpOzEiudrRqCGl+V7w+er0Y1OsD3xVmPWQgvJjLhhZnm49rfF0VRwOVb8C+5JebGl7+lbGqXxLer1GhPcPQ5GP+Mh0LVS4tHKk0qULc72stPSADAxPqW0HPbwITlFd3NGMB0H7jYPYr2flki5zsDKWyGN8GYnPw8e4RAoGAdVPizvPdq3Pf8FjFepO/CzSrWv2+TghiEgvRgPwOmNDFzh5uOUrquPDj6pcSY/MZMGTHb8uzt3h9Mmzstum9LdYb3MWowBUsPWXzAys23xusQzJXVAWkIbei+7PEqyMGS9YjMHGCjghYgln7cdwKVnNi69L8dmM2ygvPfMr3e1cCgYBIEOuyDFCY4ytGktw4zKAymUGHSOakoPhY2v8JTqr1I6Y6T1Sh/Zc8+TpOrQlbWZbos32YZ0L7CtjMVyRNjvZLaGuO/82Enb/t5gahrJaDJdF++dELW4wQ6YovYK6ZYUj4KHcZZZp+nSTQPIMLNrR9K1HZg5pW9/IvopvFl4RdRw==');
  return _decrypt.decrypt(data);
};

router.post(
  '/login',
  function (req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1];

    try {
      const username = req.body ? req.body.username : null;
      const password = req.body ? req.body.password : null;
      if (username == null || !password) return res.sendStatus(401);

      AuthModel
        .find({ username })
        .then((docs) => {
          if (!docs || docs.length == 0) return res.send(401, 'Username or password is incorrect. Please try again.');

          let user = docs[0].toJSON();
          if (user && decrypt(password) === decrypt(user.password)) {
            delete user.password;
            // log('User authenticated', email);
            return res.sendStatus(200);
          }
          return res.send(401, 'Email or password is incorrect. Please try again.')
        })
        .catch(e => {
          console.info('Failed to read user login', req.body, e);
          return res.sendStatus(500, {error: e})
        });

    } catch(e) {
      console.info('Failed to authenticate login', req.body, e);
      return res.sendStatus(500, {error: e})
    }
  }
);



router.post(
  '/register',
  function (req, res, next) {
    try {
      // const authHeader = req.headers['authorization']
      // const token = authHeader && authHeader.split(' ')[1];
      // const decrypted = jwt.verify(token, process.env.COMPLETING_REGISTRATION_KEY);

      let user = req.body;
      if (user) {

        const doc = {
          _id: new ObjectId(),
          username: user.username,
          password: user.password
        };

        const auth = new AuthModel(doc);
        auth.save();
        return res.sendStatus(201);
      } else {
        return res.sendStatus(401)
      }
    } catch(e) {
      console.info('Failed to complete registration', req.body, e);
      res.sendStatus(500, {error: e});
    }
  }
);

export default router;