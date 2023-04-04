import { useEffect, useRef, useState, useCallback } from "react";
import "./App.css";
import { mock } from "./mockData";

const offset = 50;

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const observer = useRef();
  const hasMore = mock.length > data.length;

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setData(mock.slice(0, offset));
      setLoading(false);
    }, 1000);
  }, []);

  const ref = useCallback(
    (node) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setLoading(true);
          setTimeout(() => {
            setData([
              ...data,
              ...mock.slice(data.length, data.length + offset),
            ]);
            setLoading(false);
          }, 1000);
        }
      });
      if (node) observer.current.observe(node);
    },
    [data]
  );

  return (
    <>
      {loading && data.length === 0 ? (
        <div>Loading...</div>
      ) : (
        <>
          {data?.map((v, i) => (
            <div key={i} className="item" ref={ref}>
              <p>{i + 1}</p>
              <div>
                <img src={v.avatar} alt="avatar" />
              </div>
              <p>
                {v.fullname.length > 35
                  ? `${v.fullname.substring(0, 35)}...`
                  : v.fullname}
              </p>
              <p>{v.maxspeed}</p>
              <p>{v.time}</p>
              <p>{v.penaltyTime}</p>
            </div>
          ))}
          {loading && <div>Loading...</div>}
        </>
      )}
    </>
  );
}

export default App;
