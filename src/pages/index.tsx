import { useState, useEffect } from "preact/hooks";
import "../style.css";
import { fetchPayload } from "../utils/fetchPayload";
import Masonry from "react-masonry-component";
import Header from "../components/Header";
import { Link } from "preact-router";
export function Home() {
  // init collection for output metadata;
  const [output, setOutput] = useState([]);

  // set _baseURI - todo: put _baseURI in env.
  const _baseURI = "https://p01--admin-cms--qbt6mytl828m.code.run";

  // cache data
  useEffect(() => {
    // clear cache on first time loading the page
    if (!localStorage.getItem("firstLoad")) {
      localStorage.clear();
      localStorage.setItem("firstLoad", "true");
    }

    const cachedData = localStorage.getItem("graphicDesignOutput");
    if (cachedData) {
      // check if cachedData exists, if so - use CachedData
      setOutput(JSON.parse(cachedData));
    } else {
      // if cache doesn't exist. Fetch data from Payload.
      fetchPayload(_baseURI, "graphicDesignOutput").then((data) => {
        setOutput(data["docs"]);
        // cache fetched data.
        localStorage.setItem(
          "graphicDesignOutput",
          JSON.stringify(data["docs"]),
        );
      });
    }
  }, []);

  // sort items by Date (new to old)
  if (output.length) {
    output.sort((a, b) => {
      let dateA = new Date(a.info.datePublished);
      let dateB = new Date(b.info.datePublished);
      return dateB - dateA; // reverse to show oldest to new.
    });
  }

  // masonry options
  const masonryOptions = {
    gutter: 20,
  };

  const styles = {
    margin: "10px 0", // Adds 10px of space on the top and bottom of each element
  };

  return (
    <div>
      <Header />
      <Masonry options={masonryOptions}>
        {output.map((o, index) => (
          <div style={styles}>
            <Link href={`/work/${o.uri}`}>
              <img
                onClick={() => console.log(o)}
                className={"masonry-item box-shadow"}
                src={o["mainMedia"]["url"]}
                alt={`image depiciting the graphic design: ${o.title}`}
              />
            </Link>
          </div>
        ))}
      </Masonry>
    </div>
  );
}

export default Home;
