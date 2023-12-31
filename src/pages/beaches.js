import Navbar from "@/components/Navbar";
import Card from "@/components/beachCards/Card";
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";

export default function Beaches() {

   

    const [confirmation, setConfirmation] = useState(false);
    const [beachesAvailable, setBeachesAvailable] = useState();
    const [dataToSend, setDataToSend] = useState({
        date: "",
        locationId: "",
        participants: "",
    });

    const handleStateChange = (field, value) => {
        setDataToSend((prevState) => ({
            ...prevState,
            [field]: value,
        }));
    };

    const fetchData = async () => {
        const res = await fetch("api/beaches/");
        const data = await res.json();
        return data;
    };

    const fetchWeather = async () => {
        console.log('oi')
        const lat = 58.7984;
        const lng = 17.8081;
        const params = "waveHeight,airTemperature";

        const res = await fetch(
            `https://api.stormglass.io/v2/weather/point?lat=${lat}&lng=${lng}&params=${params}`,
            {
                headers: {
                    Authorization:
                        "467f8204-0b22-11ee-a26f-0242ac130002-467f8272-0b22-11ee-a26f-0242ac130002",
                },
            }
        );
        const data = await res.json();
        console.log(await data);
    };

    /*     GETS DATA FROM FIELDS */

    useEffect(() => {
        (async () => {
            const beaches = await fetchData();
            setBeachesAvailable(beaches);
        })();
    }, []);

    const postGame = async () => {
        const res = await fetch("api/surf/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(dataToSend),
        });
        const data = await res.json();
        console.log(data);
        const status = res.status;
        if (status === 201) {
            toast.success("Evento criado!", {
                position: "bottom-center",
                autoClose: 1500,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        } else if (status === 401) {
            toast.error(data.msg, {
                position: "bottom-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        }
    };

    return (
        <div className="flex flex-col items-center  ">
            <ul className="mb-24 z-30 flex flex-wrap gap-2 justify-center">
                {beachesAvailable?.map((ele) => (
                    <li key={ele._id}>
                        <Card
                            cardId={ele._id}
                            image={ele.img}
                            dificulty={ele.dificulty}
                            name={ele.name}
                            location={ele.location}
                            address={ele.address}
                            description={ele.description}
                            handleInfo={(field, value) =>
                                handleStateChange(field, value)
                            }
                            postGame={postGame}
                        />
                    </li>
                ))}
            </ul>

            
            <ToastContainer
                position="bottom-center"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
            />
            <Navbar page={"page"} />
        </div>
    );
}
