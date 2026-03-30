/* ============================================================
   ORDINATION MAPPING
   Location: /test/dcs/js/app/sc-ordination-data.js
   ============================================================ */
var ordinationMapping = {
    deacon: {
        checkId: "ord-deacon-check",
        fields: [
            { inputId: "deacon-name-gr-acc", dataKey: "client_gr_US_goa|cl.ordinand.deacon.acc.text" },
            { inputId: "deacon-name-gr-gen", dataKey: "client_gr_US_goa|cl.ordinand.deacon.gen.text" },
            { inputId: "deacon-name-en", dataKey: "client_en_US_goa|cl.ordinand.deacon.acc.text" },
            { inputId: "deacon-name-en", dataKey: "client_en_US_goa|cl.ordinand.deacon.gen.text" }
        ]
    },
    priest: {
        checkId: "ord-priest-check",
        fields: [
            { inputId: "priest-name-gr-acc", dataKey: "client_gr_US_goa|cl.ordinand.priest.acc.text" },
            { inputId: "priest-name-gr-gen", dataKey: "client_gr_US_goa|cl.ordinand.priest.gen.text" },
            { inputId: "priest-name-en", dataKey: "client_en_US_goa|cl.ordinand.priest.acc.text" },
            { inputId: "priest-name-en", dataKey: "client_en_US_goa|cl.ordinand.priest.gen.text" }
        ]
    }
};
