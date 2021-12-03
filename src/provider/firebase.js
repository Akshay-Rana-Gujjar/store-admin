import React, { createContext } from 'react'
import app from '../utils/firebase';

export const FirebaseContext = createContext(null);

export default function Firebase({children}) {

	const data = {
		app
	}

	return (
		<FirebaseContext.Provider value={data}>
			{children}
		</FirebaseContext.Provider>
	)
}
