import React, { Component } from 'react';
import './App.css';
import { Formik } from 'formik'
import * as Yup from 'yup'
import axios from 'axios'


export const ACTION_TYPES = {
  LOGIN: 'authentication/LOGIN',
  GET_SESSION: 'authentication/GET_SESSION',
  LOGOUT: 'authentication/LOGOUT',
  CLEAR_AUTH: 'authentication/CLEAR_AUTH',
  ERROR_MESSAGE: 'authentication/ERROR_MESSAGE'
};
export const AUTH_TOKEN_KEY = 'jhi-authenticationToken';

class App extends Component {
  state = {
    loggedin: false
  }

  onSigninClicked = () => {
    console.log("username is : " + this.state.username + " password is : " + this.state.password)
  }

  handleSubmit = (value) => {
    // console.log(value)
    axios.post('http://vdevstgms:8080/auth/login', JSON.stringify( value.username, value.password ))
    axios({
      method: 'post',
      proxy: {
        host: '127.0.0.1',
        port: 3000,
        auth: {
          username: value.username,
          password: value.password
        }
      },
      url: 'auth/login',
      baseURL: 'http://vdevstgms:8080/',
      responseType: 'json',
      xsrfCookieName: 'XSRF-TOKEN',
      xsrfHeaderName: 'X-XSRF-TOKEN'
    })
    /* .then(function (response) {
      console.log(response.data + "asu");
      console.log(response.status + "asu1");
      console.log(response.statusText + "asu2");
      console.log(response.headers + "asu3");
      console.log(response.config + "asu4");
    }); */

    .then(res => {
      console.log(res)
      console.log(res.data);
      this.setState({
        loggedin: true
      })
    })
  }

  validationSchema = Yup.object().shape({
    username: Yup.string()
      .email("invalid email Address")
      .min(9, "minimum length is 9 chars")
      .required("user name is required"),

    password: Yup.string()
      .min(5, "min length is 5 chars")
      .required("password is required")
  })

  render() {
    return (
      <div>

        {this.state.loggedin ? "successfully logged in" : <Formik
          onSubmit={this.handleSubmit}
          validationSchema={this.validationSchema}
          render={(formikProps) => {
            return (
              <div>
                <h1>Login Example</h1>

                <label htmlFor="username">User Name</label>
                <input type="text" id="username" name="username"
                  onChange={formikProps.handleChange}
                  value={formikProps.username} />
                <p>{formikProps.errors.username}</p>
                <br />

                <label htmlFor="password">Password</label>
                <input type="password" id="password" name="password"
                  onChange={formikProps.handleChange}
                  value={formikProps.password} />
                <p>{formikProps.errors.password}</p>
                <br />

                <button onClick={formikProps.submitForm} disabled={!formikProps.isValid}>Sign in</button>
              </div>
            )
          }}
        />}
      </div>
    );
  }
}

export default App;
