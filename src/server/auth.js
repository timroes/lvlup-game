import auth from 'http-auth';
import {fileExists} from './utils';
import {app} from './server';

export default function authPath(path, htpasswd, realm) {
	if (fileExists(htpasswd)) {
		app.use(path, auth.connect(auth.basic({
			realm: realm || 'Authenticate',
			file: htpasswd
		})));
	}
};