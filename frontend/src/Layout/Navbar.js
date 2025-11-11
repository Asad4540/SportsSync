import React from "react";
import { Link, Outlet } from "react-router-dom";

function Navbar() {
    return (
        <>
            <nav class="navbar navbar-expand-lg navbar-dark bg-primary p-4">
                <a class="navbar-brand" href="#">User Management CRUD</a>
                <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarText">
                    <ul class="navbar-nav mr-auto">
                        <li class="nav-item active">
                            <Link class="nav-link" to='/'>Home </Link>
                        </li>
                        <li class="nav-item">
                            <Link class="nav-link" to="/adduser">Add User</Link>
                        </li>
                    </ul>
                </div>
            </nav>

            <div className="d-flex">

                <div className="bg-primary text-white" style={{ width: '15%', height: '100vh' }}>
                    <ul>
                        <li >
                            Option 1
                        </li>
                        <li>
                            Option 2
                        </li>
                    </ul>
                </div>

                <div className="p-2">
                     <Outlet /> 
                </div>


            </div>


        </>
    )
}

export default Navbar;