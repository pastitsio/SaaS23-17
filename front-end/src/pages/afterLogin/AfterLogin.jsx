import React, { useEffect, useState } from 'react'
import { Container, Spinner } from 'react-bootstrap'

import { UserService } from '../../services'

import './afterLogin.css'

const AfterLogin = () => {
	const [resolvedNewUser, setResolvedNewUser] = useState(null);
	const [isNewUser, setIsNewUser] = useState(null);

	useEffect(() => {
		const checkNewUser = async () => {
			const response = await UserService.checkNewUser();
			// const json = await response.json();
			console.log('json :>> ', response);
			setResolvedNewUser(true);
			setIsNewUser(response.newUser);
		}
		checkNewUser();
	}, [])


	return (
		<Container id='new-user-container'>
			{!resolvedNewUser
				? <Spinner animation='border' variant='light' /> // if is loading: display spinner
				: isNewUser
					? ("new User")
					: ("not new User")
			}
		</Container>
	)

}

export default AfterLogin