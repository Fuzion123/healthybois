import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import React, { useEffect } from 'react';

export { Home };

function Home() {

    const auth = useSelector(x => x.auth.value);

    if(auth?.isAdmin === true){
        return (
            <div className="min-h-screen">
            {/* Header */}
            <header className="text-center py-4 px-8">
              <h1 className="text-2xl font-bold">Welcome {auth?.firstName}</h1>
            </header>
      
            {/* Sections */}
            <div className="container mx-auto px-4 py-8">
              <section className="mb-8">
                <h2 className="text-xl font-bold mb-4">Section 1</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-white p-8 shadow-md rounded-lg">
                    <h3 className="text-xl font-bold mb-2">Box 1</h3>
                    <p className="text-gray-600">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                  </div>
                  <div className="bg-white p-8 shadow-md rounded-lg">
                    <h3 className="text-xl font-bold mb-2">Box 2</h3>
                    <p className="text-gray-600">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                  </div>
                </div>
              </section>
      
              <section className="mb-8">
                <h2 className="text-xl font-bold mb-4">Section 2</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-white p-8 shadow-md rounded-lg">
                    <h3 className="text-xl font-bold mb-2">Box 1</h3>
                    <p className="text-gray-600">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                  </div>
                  <div className="bg-white p-8 shadow-md rounded-lg">
                    <h3 className="text-xl font-bold mb-2">Box 2</h3>
                    <p className="text-gray-600">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                  </div>
                </div>
              </section>
      
              <section>
                <h2 className="text-xl font-bold mb-4">Section 3</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-white p-8 shadow-md rounded-lg">
                    <h3 className="text-xl font-bold mb-2">Box 1</h3>
                    <p className="text-gray-600">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                  </div>
                  <div className="bg-white p-8 shadow-md rounded-lg">
                    <h3 className="text-xl font-bold mb-2">Box 2</h3>
                    <p className="text-gray-600">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        );
    }

    return (
        <div className="min-h-screen">
        {/* Header */}
        <header className="text-center py-4 px-8">
          <h1 className="text-2xl font-bold">Welcome {auth?.firstName}</h1>
        </header>
  
        {/* Sections */}
        <div className="container mx-auto px-4 py-8">
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">Section 1</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white p-8 shadow-md rounded-lg">
                <h3 className="text-xl font-bold mb-2">Box 1</h3>
                <p className="text-gray-600">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
              </div>
              <div className="bg-white p-8 shadow-md rounded-lg">
                <h3 className="text-xl font-bold mb-2">Box 2</h3>
                <p className="text-gray-600">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
              </div>
            </div>
          </section>
  
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">Section 2</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white p-8 shadow-md rounded-lg">
                <h3 className="text-xl font-bold mb-2">Box 1</h3>
                <p className="text-gray-600">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
              </div>
              <div className="bg-white p-8 shadow-md rounded-lg">
                <h3 className="text-xl font-bold mb-2">Box 2</h3>
                <p className="text-gray-600">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
              </div>
            </div>
          </section>
  
          <section>
            <h2 className="text-xl font-bold mb-4">Section 3</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white p-8 shadow-md rounded-lg">
                <h3 className="text-xl font-bold mb-2">Box 1</h3>
                <p className="text-gray-600">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
              </div>
              <div className="bg-white p-8 shadow-md rounded-lg">
                <h3 className="text-xl font-bold mb-2">Box 2</h3>
                <p className="text-gray-600">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    );
}
