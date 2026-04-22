import React, { useCallback, useEffect, useState } from "react";
import { api, useFetch } from "../../Components/CommonImports/CommonImports";
import NewTable from "../../Components/NewTable/NewTable";
import ReconcileMappingTable from "./ReconcileMappingTable";

const ReconcileMapping = ({ transactionId, transactionAmount }) => {
    const { get, response } = useFetch({ data: [] });
    const [mappingData, setMappingData] = useState([]);

    const loadMappingDetails = useCallback(async () => {
        if (!transactionId) return;


        const data = await get(`${api}/makePayment/getByTransaction/${transactionId}`);
        console.log(" data for mmaped datas", data)
        console.table(data)
        if (response.ok) {
            setMappingData(data);
        }
    }, [get, response, transactionId]);

    useEffect(() => {
        loadMappingDetails();
    }, [loadMappingDetails]);

    return (
        <div>

            <h5 style={{ marginBottom: "20px", color: "#01495e" }}>
                Bank Transaction Balance: <b>{transactionAmount}</b>
            </h5>

            <NewTable
                cols={ReconcileMappingTable()}
                data={mappingData}
                striped
                rows={10}
                title="Mapped Invoice Details"
                enableSearch={true}
                hideSNo={true}
            />
        </div>
    );
};

export default ReconcileMapping;