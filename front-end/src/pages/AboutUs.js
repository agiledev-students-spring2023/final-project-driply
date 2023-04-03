import React, { useContext } from 'react';
import { DarkModeContext } from '../context/DarkModeContext';
import { useNavigate } from 'react-router-dom';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

export default function AboutUs() {

    const { ifDarkMode } = useContext(DarkModeContext);
    const navigate = useNavigate();

    return (
        <div className={`aboutUsPage ${ifDarkMode && "darkTheme"}`}>
            {/* header */}
            <div className={`aboutUsHeader`}>
                <p className='abtUsGoBack' onClick={() => navigate("/settings")}><ArrowBackIosIcon /></p>
                <p>About Us</p>
            </div>

            <div className='aboutUsBody'>
                <h1>What is Driply?</h1>

                <h4>To connect fashion enthusiast and promote greater accessibility of fashion trends and outfits.</h4>
                <br />
                <p>Driply is a fashion social networking app where users can share their outfits as well as find inspirations and new stores. 
                    This application and the community will be dedicated entirely to budget fashion and making fashion and trends as accessible 
                    as apossible for everyone. Users can share and view outfits with accompanying information like price range and source. Liking, 
                    commenting, and chatting will be some functionalities to increase interactivity between users. Users also can personalize their 
                    feed by following other users as well as bookmarking particularly interesting posts.</p>
            </div>
            
            <h2>Meet the team</h2>
            <div className='meetTheTeam'>
                <div className='eachDev'>
                    <img src='https://github.com/MannySotoRuiz.png' alt='Manny' />
                    <a href='https://github.com/MannySotoRuiz' className='devHandler'>@Manny Soto Ruiz</a>
                    <p className='devName'>Senior SWE</p>
                </div>
                <div className='eachDev'>
                    <img src='https://github.com/b-chen00.png' alt='Brandon' />
                    <a href='https://github.com/b-chen00' className='devHandler'>@Brandon Chen</a>
                    <p className='devName'>Senior SWE</p>
                </div>
                <div className='eachDev'>
                    <img src='https://github.com/DarrenLe20.png' alt='Darren' />
                    <a href='https://github.com/DarrenLe20' className='devHandler'>@Darren Le</a>
                    <p className='devName'>Senior SWE</p>
                </div>
                <div className='eachDev'>
                    <img src='https://github.com/kevincwpark.png' alt='Kevin' />
                    <a href='https://github.com/kevincwpark' className='devHandler'>@Kevin Park</a>
                    <p className='devName'>Senior SWE</p>
                </div>
                <div className='eachDev'>
                    <img src='https://github.com/Amaanmkhwaja.png' alt='Amaan' />
                    <a href='https://github.com/Amaanmkhwaja' className='devHandler'>@Amaan Khwaja</a>
                    <p className='devName'>Senior SWE</p>
                </div>
            </div>
        </div>
    );

}