import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './assets/pages/homepage.jsx';
import PersonalDetails from './assets/pages/personalDetails.jsx';
import ProductForm from './assets/pages/add.jsx';
import Signup from './assets/pages/signup.jsx';
import Login from './assets/pages/login.jsx';
import ProtectedRoute from './assets/pages/isLogin.jsx';
import OrderForm from './assets/pages/placeOrder.jsx';
import Admin from './assets/pages/admin.jsx';
import Edit from './assets/pages/edit.jsx';
import Vieworder from './assets/pages/vieworder.jsx';
import Myorder from './assets/pages/myorder.jsx';
import Category from './assets/pages/category.jsx';
import AddToCart from './assets/pages/addtocart.jsx';
import Ordercard from './assets/pages/ordercard.jsx';
import  OTPPage from "./assets/pages/OTPPage";
import NotFoundPage from './assets/pages/pagenotfound.jsx';
// Define routes
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: 'add',
        element: (
          <ProtectedRoute>
            <ProductForm />
          </ProtectedRoute>
        ),
      },
      {
        path: 'home',
        element: <Home />,
      },
      {
        path: 'personaldetails',
        element: <PersonalDetails />,
      },
      {
        path: 'signup',
        element: <Signup />,
      },
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'order',
        element:(
          <ProtectedRoute>
            <OrderForm/>
          </ProtectedRoute>
        )
      },
      {
        path: 'admin',
        element:(
          <ProtectedRoute>
            <Admin/>
          </ProtectedRoute>
        ),
      },
      {
        path:'/edit/:id',
        element:(
          <ProtectedRoute>
           <Edit/>
          </ProtectedRoute>
        )
      },
      {
        path:'/vieworder',
        element:(
          <ProtectedRoute>
           <Vieworder/>
          </ProtectedRoute>
        )
      },
      {
        path:'/myorder',
        element:(
          <ProtectedRoute>
           <Myorder/>
          </ProtectedRoute>
        )
      },
      {
        path:'/category',
        element:<Category/>
      },
      {
        path:'/addtocart',
        element:(
          <ProtectedRoute>
            <AddToCart/>
          </ProtectedRoute>
        )
      },
      {
        path:'/ordercard',
        element:(
          <ProtectedRoute>
            <Ordercard/>
          </ProtectedRoute>
        )
      },
      {
        path:'/otppage',
        element:<OTPPage/>
      },
      {
        path:'/notfoundpage',
        element:<NotFoundPage/>
      },
      {
        
          path:'*',
          element:<NotFoundPage/>
        
      }

      
     


   

    ],
  },
]);


// Render app with RouterProvider
createRoot(document.getElementById('root')).render(
  
    <RouterProvider router={router} />
  
);


export default ProductForm;
