import React from 'react';
import './App.css';
import bio from 'bio/bio.json';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch,
  Redirect
} from 'react-router-dom';


import style from './App.module.css';

import CV from '../CV';
import Timeline from '../Timeline';
import Profile from '../Profile';

import ashVideo from "./static/ash.mp4";
import ashPoster from "./static/ash.jpg";

import Loadable from 'react-loadable';
import Loading from 'react-loading';

const AsyncCV = Loadable({
  loader: () => import("components/CV"),
  loading: Loading,
  render(loaded, {data, className, phone, email}) {
    let Component = loaded.default;
    return <Component {...{data, className, phone, email}}/>
  }
});


const months = "Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" ");
const parseSimpleDate = (date) => {
    let [month, day, year] = date.split(" ");
    month = months.indexOf(month);

    if (month === -1) throw Error(`invalid date ${date}`);

    return new Date(year, month, day);
}

class App extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {data: App.parseDates(bio)};
  }

  static parseDates(data) {
    data.timeline = data.timeline.map(({date, ...etc}) => {
      date = parseSimpleDate(date);

      return ({date, ...etc});
    });

    return data;
  }

  componentDidMount() {
    /*
    fetch("https://raw.githubusercontent.com/Zemnmez/bio/master/bio.json?" + Math.random())
      .then(r => r.json(), (error) => {
        console.log(error);
        return bio;
      })
      .then(data => App.parseDates(data))
      .then(data => this.setState({data}))
    */
  }

  componentWillUnmount() {
  }


  render() {
    if (!this.state.data) return "";
    const className = "App";
    return (
        <Router>
          <Switch>
          <Route exact path="/" render={() => <Home {...{
            data: this.state.data,
            className
          }}/>}/>

          <Route exact path="/cv/" render={({ location: { search } }) => {
            const params = new Map(
              search.slice(1).split("&").map(param =>
                param.split("=").map(decodeURIComponent)));
            return <AsyncCV {...{
              data: this.state.data,
              className,
              phone: params.get("phone"),
              email: params.get("email")
            }} />
          }}/>

          <Route path="/cv/" render={() => <Redirect to="/cv/"/>}/>

          <Route render={() => <Redirect to="/"/>}/>
          </Switch>

        </Router>
    );
  }
}

const Home = ({data, className}) => {
  data.who.name=undefined; // just dont want it lol

  return <div className={[style.home].concat(className).join(" ")}>
        <VideoBackground />
        <header> <div className="innerText">{data.who.handle}</div> </header>
        <article> <Profile data={data} /> </article>
  </div>
}

/*let Links = ({links}) => <div className="links">
  {Object.entries(links).map(([name, link], i) => <a key={i} href={link}>{name}</a>)}
</div> */

const VideoBackground = ({ className }) => <video {...{
    poster: ashPoster,
    autoPlay: true,
    muted: true,
    playsInline: true,
    loop: true,
    className: [style.videoBackground].concat(className).join(" ")
  }}>
  <source src={ashVideo} type="video/mp4" />
</video>

export default App;
