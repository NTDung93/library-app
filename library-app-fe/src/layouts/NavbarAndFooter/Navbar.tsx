import { useOktaAuth } from "@okta/okta-react";
import { SpinnerLoading } from "../Utils/SpinnerLoading";
import { ok } from "assert";
import { Link, NavLink } from "react-router-dom";

// export const Navbar = () => {

//     const { oktaAuth, authState } = useOktaAuth();

//     if (!authState) {
//         return <SpinnerLoading />;
//     }

//     const handleLogout = async () => oktaAuth.signOut();

//     console.log(authState);

//     return (
//         <nav className='navbar navbar-expand-lg navbar-dark main-color py-3'>
//             <div className='container-fluid'>
//                 <span className='navbar-brand'>VT Books</span>
//                 <button className='navbar-toggler' type='button'
//                     data-bs-toggle='collapse' data-bs-target='#navbarNavDropdown'
//                     aria-controls='navbarNavDropdown' aria-expanded='false'
//                     aria-label='Toggle Navigation'
//                 >
//                     <span className='navbar-toggler-icon'></span>
//                 </button>
//                 <div className='collapse navbar-collapse' id='navbarNavDropdown'>
//                     <ul className='navbar-nav'>
//                         <li className='nav-item'>
//                             <a className='nav-link' href='/'>Home</a>
//                         </li>
//                         <li className='nav-item'>
//                             <a className='nav-link' href='/search'>Search Books</a>
//                         </li>
//                         {authState.isAuthenticated &&
//                             <li className='nav-item'>
//                                 <a className='nav-link' href='/shelf'>Shelf</a>
//                             </li>
//                         }
//                         {authState.isAuthenticated &&
//                             authState.accessToken?.claims?.userType === 'admin' &&
//                             <li className='nav-item'>
//                                 <a className='nav-link' href='/admin'>Admin</a>
//                             </li>
//                         }
//                     </ul>
//                     <ul className='navbar-nav ms-auto'>
//                         {!authState.isAuthenticated ?
//                             <li className='nav-item m-1'>
//                                 <a type='button' className='btn btn-outline-light' href='login'>Sign in</a>
//                             </li>
//                             :
//                             <li className='nav-item m-1'>
//                                 <button type='button' className='btn btn-outline-light' onClick={handleLogout}>Sign out</button>
//                             </li>
//                         }
//                     </ul>
//                 </div>
//             </div>
//         </nav>
//     );
// }

export const Navbar = () => {

    const { oktaAuth, authState } = useOktaAuth();
  
    if (!authState) {
      return <SpinnerLoading />
    }
  
    const handleLogout = async () => oktaAuth.signOut();
  
    console.log(authState);
  
    return (
      <nav className='navbar navbar-expand-lg navbar-dark main-color py-3'>
        <div className='container-fluid'>
          <span className='navbar-brand'>Luv 2 Read</span>
          <button className='navbar-toggler' type='button'
            data-bs-toggle='collapse' data-bs-target='#navbarNavDropdown'
            aria-controls='navbarNavDropdown' aria-expanded='false'
            aria-label='Toggle Navigation'
          >
            <span className='navbar-toggler-icon'></span>
          </button>
          <div className='collapse navbar-collapse' id='navbarNavDropdown'>
            <ul className='navbar-nav'>
              <li className='nav-item'>
                <NavLink className='nav-link' to='/home'>Home</NavLink>
              </li>
              <li className='nav-item'>
                <NavLink className='nav-link' to='/search'>Search Books</NavLink>
              </li>
              {authState.isAuthenticated &&
                <li className='nav-item'>
                  <NavLink className='nav-link' to='/shelf'>Shelf</NavLink>
                </li>
              }
              {authState.isAuthenticated && authState.accessToken?.claims?.userType === 'admin' &&
                <li className='nav-item'>
                  <NavLink className='nav-link' to='/admin'>Admin</NavLink>
                </li>
              }
            </ul>
            <ul className='navbar-nav ms-auto'>
              {!authState.isAuthenticated ?
                <li className='nav-item m-1'>
                  <Link type='button' className='btn btn-outline-light' to='/login'>Sign in</Link>
                </li>
                :
                <li>
                  <button className='btn btn-outline-light' onClick={handleLogout}>Logout</button>
                </li>
              }
            </ul>
          </div>
        </div>
      </nav>
    );
  }