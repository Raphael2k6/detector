import React, {useState} from 'react'
import axios from 'axios';

const Register = ({ onRouteChange, loadUser }) => {
    const [user, setUser] = useState('');

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const payload = {
            "name": user.name,
            "email": user.email,
            "password": user.password
        }
        axios.post('http://localhost:5002/register', payload)
            .then(response => {
                var res = response;
                console.log(res)
                console.log(res.data.id)
                if (res.data.id) {
                    loadUser(user);
                    onRouteChange('home')
            }
        })
        
            .catch(console.error());

    }
    return (
        <article className="br3 ba b--black-10 mv4 w-100 w-50-m w-25-l shadow-5 mw6 center">
            <main className="pa4 black-80">
                <form className="measure">
                    <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
                        <legend className="f1 fw6 ph0 mh0">Register</legend>
                        <div className="mt3">
                            <label className="db fw6 lh-copy f6" htmlFor="name">Name</label>
                            <input
                                className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                                type="text"
                                name="name"
                                id="name"
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mt3">
                            <label className="db fw6 lh-copy f6" htmlFor="email-address">Email</label>
                            <input
                                className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                                type="email"
                                name="email"
                                id="email-address"
                                onChange={handleChange}
                                required

                            />
                        </div>
                        <div className="mv3">
                            <label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
                            <input
                                className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                                type="password"
                                name="password"
                                id="password"
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </fieldset>
                    <div className="">
                        <input
                            className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
                            type="submit"
                            value="Register"
                            onClick={handleSubmit}
                        />
                    </div>
                </form>
            </main>
        </article>
    )
}

export default Register
