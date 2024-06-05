import React from 'react';
import '../styles/HomePage.css';

const HomePage = () => {
  return (
    <div className="homepage container">
      <h1>Welcome to Gym Buddies</h1>
      <p>Join our community to share and discover workouts, track your progress, and connect with others!</p>
      <div className="home-images">
        <a href="http://localhost:3000/workout/664b82550f7dd84976375d3e">
          <div className="workout">
            <h3>Chest Workout</h3>
            <img src="https://cdn.muscleandstrength.com/sites/default/files/styles/400x400/public/field/image/article/chest-builders-450.jpg?itok=gOBeEaFb" alt="Chest" />
          </div>
        </a>
        <a href="http://localhost:3000/workout/664bacb22979d48c1389c829">
          <div className="workout">
            <h3>Back Workout</h3>
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRa1xl77LCUU90OpDLjsPhaNFf3jLQKjdTF0D1UL5sBRg&s" alt="Back" />
          </div>
        </a>
        <a href="http://localhost:3000/workout/664badba33bd13d142b53137">
          <div className="workout">
            <h3>Legs Workout</h3>
            <img src="https://i0.wp.com/www.muscleandfitness.com/wp-content/uploads/2019/06/2-walking-lunge-1109.jpg?quality=86&strip=all" alt="Legs" />
          </div>
        </a>
        <a href="http://localhost:3000/workout/664baedc37a92aa6417044cd">
          <div className="workout">
            <h3>Shoulder Workout</h3>
            <img src="https://www.dmarge.com/wp-content/uploads/2021/07/best-shoulder-workouts-men-1.jpg" alt="Shoulder" />
          </div>
        </a>
        <a href="http://localhost:3000/workout/664bb015a0253e00ae4fc7f7">
          <div className="workout">
            <h3>Abs Workout</h3>
            <img src="https://www.usatoday.com/gcdn/presto/2021/07/21/USAT/dfbd657c-1ef5-4dd9-b355-1619bdc2645f-GettyImages-924491214.jpg?crop=1414,1414,x353,y0" alt="Abs" />
          </div>
        </a>
        <a href="http://localhost:3000/workout/664bb0e195644a8a1b75eca9">
          <div className="workout">
            <h3>Arms Workout</h3>
            <img src="https://www.bodybuilding.com/images/2016/december/5-arm-blasting-workouts-for-mass-2-700xh.jpg" alt="Arms" />
          </div>
        </a>
      </div>
    </div>
  );
};

export default HomePage;
