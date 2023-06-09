import axios from "axios";
import ReactEcharts from "echarts-for-react";
import React, { useEffect, useState } from "react";
import "../../styles/home.scss";

const Home = () => {
  const [books, setBooks] = useState([]);
  const [dead, setDead] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        if (!loaded) {
          const res = await axios.get(
            `https://www.anapioficeandfire.com/api/books?pageSize=50`
          );

          const getDead = await axios.get(
            `https://www.anapioficeandfire.com/api/characters?isAlive=false&page=1&pageSize=50`
          );

          if (res.data && getDead.data.length) {
            setBooks(res.data);
            setDead(getDead.data);

            setLoaded(false);
          }
        }
      } catch (err) {
        return console.log(err);
      }
    })();
  }, [loaded]);

  const statBooks = () => {
    let authorList = [];

    if (books.length) {
      books.forEach((books) => {
        let result = { value: 0, name: books.name };
        if (books.authors[0].length) {
          books.authors.forEach((author) => {
            result.value = result.value + 1;
          });
          authorList.push(result);
        }
      });
      if (authorList.length) {
        return authorList;
      }
    }
  };

  const statCharacters = () => {
    let genders = { male: 0, female: 0, none: 0 };

    dead.forEach((character) => {
      if (character.gender) {
        character.gender === "Male"
          ? (genders.male = genders.male + 1)
          : character.gender === "Female"
          ? (genders.female = genders.female + 1)
          : (genders.none = genders.none + 1);
      }
    });

    return [
      { value: genders.male, name: "male" },
      { value: genders.female, name: "female" },
      { value: genders.none, name: "unknown" },
    ];
  };

  if (books.length && dead) {
    const option = {
      title: {
        text: "Number of author per book",
        left: "center",
        textStyle: {
          color: "white",
        },
      },
      tooltip: {
        trigger: "item",
      },
      series: [
        {
          name: "Access From",
          type: "pie",
          radius: "50%",
          data: statBooks(),
          label: {
            color: "white",
          },
        },
      ],
    };

    const option2 = {
      title: {
        text: "Gender of 50 dead characters",
        left: "center",
        textStyle: {
          color: "white",
        },
      },
      tooltip: {
        trigger: "item",
      },
      series: [
        {
          name: "Access From",
          type: "pie",
          radius: "50%",
          data: statCharacters(),
          label: {
            color: "white",
          },
        },
      ],
    };

    return (
      <div className="home">
        <h1>Welcome to your Game Of Thrones</h1>
        <p>
          You can find the list of all the characters, the different houses and
          all the books.
        </p>
        <ReactEcharts option={option} className="chart" />
        <ReactEcharts option={option2} />
      </div>
    );
  }
};

export default Home;
