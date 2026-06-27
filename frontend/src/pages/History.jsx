import { useEffect, useState } from "react";
import api from "../services/api";

function History() {

    const [history, setHistory] = useState([]);

    useEffect(() => {

        fetchHistory();

    }, []);

    async function fetchHistory() {

        try {

            const token = localStorage.getItem("token");

            const response = await api.get(

                "/interview/history",

                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }

            );

            setHistory(response.data);

        }

        catch (error) {

            console.log(error);

            alert("Unable to load interview history.");

        }

    }

    return (

        <div
            style={{
                width: "80%",
                margin: "40px auto"
            }}
        >

            <h1>Interview History</h1>

            <table
                border="1"
                cellPadding="10"
                style={{
                    width: "100%",
                    borderCollapse: "collapse"
                }}
            >

                <thead>

                    <tr>

                        <th>Role</th>

                        <th>Difficulty</th>

                        <th>Score</th>

                        <th>Date</th>

                    </tr>

                </thead>

                <tbody>

                    {

                        history.map((item) => (

                            <tr key={item.session_id}>

                                <td>{item.role}</td>

                                <td>{item.difficulty}</td>

                                <td>{item.overall_score}</td>

                                <td>
                                    {new Date(item.created_at).toLocaleString()}
                                </td>

                            </tr>

                        ))

                    }

                </tbody>

            </table>

        </div>

    );

}

export default History;
