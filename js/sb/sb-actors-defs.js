/* ============================================================
   ACTOR MAPPING
   ============================================================ */
var actorMapping = {
    'ac.sb.DeBl': {
        defen: 'DEACON',
        defgr: 'ΔΙΑΚΟΝΟΣ',
        alten: '',
        altgr: ''
    },


    'ac.sb.ChHi': {
        defen: 'CHOIR',
        defgr: 'ΧΟΡΟΣ',
        archbishop_alten: 'ARCHBISHOP',
        archbishop_altgr: 'ΑΡΧΙΕΠΙΣΚΟΠΟΣ',
        bishop_alten: 'BISHOP',
        bishop_altgr: 'ΕΠΙΣΚΟΠΟΣ',
        hierarch_alten: 'HIERARCH',
        hierarch_altgr: 'ΑΡΧΙΕΡΕΥΣ',
        metropolitan_alten: 'METROPOLITAN',
        metropolitan_altgr: 'ΜΗΤΡΟΠΟΛΙΤΗΣ',
        patriarch_alten: 'PATRIARCH',
        patriarch_altgr: 'ΠΑΤΡΙΑΡΧΗΣ'
    },

    'ac.sb.ClHi': {
        defen: 'CLERGY',
        defgr: 'ΚΛΗΡΟΣ',
        archbishop_alten: 'ARCHBISHOP',
        archbishop_altgr: 'ΑΡΧΙΕΠΙΣΚΟΠΟΣ',
        bishop_alten: 'BISHOP',
        bishop_altgr: 'ΕΠΙΣΚΟΠΟΣ',
        hierarch_alten: 'HIERARCH',
        hierarch_altgr: 'ΑΡΧΙΕΡΕΥΣ',
        metropolitan_alten: 'METROPOLITAN',
        metropolitan_altgr: 'ΜΗΤΡΟΠΟΛΙΤΗΣ',
        patriarch_alten: 'PATRIARCH',
        patriarch_altgr: 'ΠΑΤΡΙΑΡΧΗΣ'
    },

    'ac.sb.DePe': {
        defen: 'DEACON',
        defgr: 'ΔΙΑΚΟΝΟΣ',
        alten: 'PEOPLE',
        altgr: 'ΛΑΟΣ'
    },

    'ac.sb.DePr': {
        defen: 'DEACON',
        defgr: 'ΔΙΑΚΟΝΟΣ',
        alten: 'PRIEST',
        altgr: 'ΙΕΡΕΥΣ'
    },

    'ac.sb.PrCl': {
        defen: 'PRIEST',
        defgr: 'ΙΕΡΕΥΣ',
        alten: 'CLERGY',
        altgr: 'ΚΛΗΡΟΣ'
    },

    'ac.sb.PrHi': {
        defen: 'PRIEST',
        defgr: 'ΙΕΡΕΥΣ',
        archbishop_alten: 'ARCHBISHOP',
        archbishop_altgr: 'ΑΡΧΙΕΠΙΣΚΟΠΟΣ',
        bishop_alten: 'BISHOP',
        bishop_altgr: 'ΕΠΙΣΚΟΠΟΣ',
        hierarch_alten: 'HIERARCH',
        hierarch_altgr: 'ΑΡΧΙΕΡΕΥΣ',
        metropolitan_alten: 'METROPOLITAN',
        metropolitan_altgr: 'ΜΗΤΡΟΠΟΛΙΤΗΣ',
        patriarch_alten: 'PATRIARCH',
        patriarch_altgr: 'ΠΑΤΡΙΑΡΧΗΣ'
    },

    'ac.sb.IL.DePr': {
        defen: 'DEACON',
        defgr: 'ΔΙΑΚΟΝΟΣ',
        alten: 'PRIEST',
        altgr: 'ΙΕΡΕΥΣ'
    },

    'ac.sb.IL.PrHi': {
        defen: 'PRIEST',
        defgr: 'ΙΕΡΕΥΣ',
        archbishop_alten: 'ARCHBISHOP',
        archbishop_altgr: 'ΑΡΧΙΕΠΙΣΚΟΠΟΣ',
        bishop_alten: 'BISHOP',
        bishop_altgr: 'ΕΠΙΣΚΟΠΟΣ',
        hierarch_alten: 'HIERARCH',
        hierarch_altgr: 'ΑΡΧΙΕΡΕΥΣ',
        metropolitan_alten: 'METROPOLITAN',
        metropolitan_altgr: 'ΜΗΤΡΟΠΟΛΙΤΗΣ',
        patriarch_alten: 'PATRIARCH',
        patriarch_altgr: 'ΠΑΤΡΙΑΡΧΗΣ'
    },

    'ac.sb.ReHi': {
        defen: 'READER',
        defgr: 'ΑΝΑΓΝΩΣΤΗΣ',
        archbishop_alten: 'ARCHBISHOP',
        archbishop_altgr: 'ΑΡΧΙΕΠΙΣΚΟΠΟΣ',
        bishop_alten: 'BISHOP',
        bishop_altgr: 'ΕΠΙΣΚΟΠΟΣ',
        hierarch_alten: 'HIERARCH',
        hierarch_altgr: 'ΑΡΧΙΕΡΕΥΣ',
        metropolitan_alten: 'METROPOLITAN',
        metropolitan_altgr: 'ΜΗΤΡΟΠΟΛΙΤΗΣ',
        patriarch_alten: 'PATRIARCH',
        patriarch_altgr: 'ΠΑΤΡΙΑΡΧΗΣ'
    },

    'ac.Hierarch': {
        defen: 'HIERARCH',
        defgr: 'ΑΡΧΙΕΡΕΥΣ',
        archbishop_alten: 'ARCHBISHOP',
        archbishop_altgr: 'ΑΡΧΙΕΠΙΣΚΟΠΟΣ',
        bishop_alten: 'BISHOP',
        bishop_altgr: 'ΕΠΙΣΚΟΠΟΣ',
        hierarch_alten: 'HIERARCH',
        hierarch_altgr: 'ΑΡΧΙΕΡΕΥΣ',
        metropolitan_alten: 'METROPOLITAN',
        metropolitan_altgr: 'ΜΗΤΡΟΠΟΛΙΤΗΣ',
        patriarch_alten: 'PATRIARCH',
        patriarch_altgr: 'ΠΑΤΡΙΑΡΧΗΣ'

    }


};



/* ============================================================
   HIERARCH CONVERSION IN RUBRICS
   when data-key ends in ".rubric"
   ============================================================ */

var episcopalRankConversions = {
    "episcopalRanks": {
        "archbishop": {

            "Ἐπίσκοπος": "Ἀρχιεπίσκοπος",
            "Ἐπίσκοπον": "Ἀρχιεπίσκοπον",
            "Ἐπισκόπου": "Ἀρχιεπισκόπου",
            "Ἐπισκόπῳ": "Ἀρχιεπισκόπῳ",
            "Bishop": "Archbishop",

            "Ἀρχιερεὺς": "Ἀρχιεπίσκοπος",
            "Ἀρχιερεύς": "Ἀρχιεπίσκοπος",
            "Ἀρχιερέα": "Ἀρχιεπίσκοπον",
            "Ἀρχιερέως": "Ἀρχιεπισκόπου",
            "Ἀρχιερεῖ": "Ἀρχιεπισκόπῳ",
            "Hierarch": "Archbishop",

            "Μητροπολίτης": "Ἀρχιεπίσκοπος",
            "Μητροπολίτην": "Ἀρχιεπίσκοπον",
            "Μητροπολίτου": "Ἀρχιεπισκόπου",
            "Μητροπολίτῃ": "Ἀρχιεπισκόπῳ",
            "Metropolitan": "Archbishop",

            "Πατριάρχης": "Ἀρχιεπίσκοπος",
            "Πατριάρχην": "Ἀρχιεπίσκοπον",
            "Πατριάρχου": "Ἀρχιεπισκόπου",
            "Πατριάρχῃ": "Ἀρχιεπισκόπῳ",
            "Patriarch": "Archbishop"
        },

        "bishop": {
            "Ἀρχιερεὺς": "Ἐπίσκοπος",
            "Ἀρχιερεύς": "Ἐπίσκοπος",
            "Ἀρχιερέα": "Ἐπίσκοπον",
            "Ἀρχιερέως": "Ἐπισκόπου",
            "Ἀρχιερεῖ": "Ἐπισκόπῳ",
            "Hierarch": "Bishop",

            "Ἀρχιεπίσκοπος": "Ἐπίσκοπος",
            "Ἀρχιεπίσκοπον": "Ἐπίσκοπον",
            "Ἀρχιεπισκόπου": "Ἐπισκόπου",
            "Ἀρχιεπισκόπῳ": "Ἐπισκόπῳ",
            "Archbishop": "Bishop",

            "Μητροπολίτης": "Ἐπίσκοπος",
            "Μητροπολίτην": "Ἐπίσκοπον",
            "Μητροπολίτου": "Ἐπισκόπου",
            "Μητροπολίτῃ": "Ἐπισκόπῳ",
            "Metropolitan": "Bishop",

            "Πατριάρχης": "Ἐπίσκοπος",
            "Πατριάρχην": "Ἐπίσκοπον",
            "Πατριάρχου": "Ἐπισκόπου",
            "Πατριάρχῃ": "Ἐπισκόπῳ",
            "Patriarch": "Bishop"
        },

        // "hierarch": {

        //     "Ἐπίσκοπος": "Ἀρχιερεύς",
        //     "Ἐπίσκοπον": "Ἀρχιερέα",
        //     "Ἐπισκόπου": "Ἀρχιερέως",
        //     "Ἐπισκόπῳ": "Ἀρχιερεῖ",
        //     "Bishop": "Hierarch",

        //     "Μητροπολίτης": "Ἀρχιερεύς",
        //     "Μητροπολίτην": "Ἀρχιερέα",
        //     "Μητροπολίτου": "Ἀρχιερέως",
        //     "Μητροπολίτῃ": "Ἀρχιερεῖ",
        //     "Metropolitan": "Hierarch",

        //     "Πατριάρχης": "Ἀρχιερεύς",
        //     "Πατριάρχην": "Ἀρχιερέα",
        //     "Πατριάρχου": "Ἀρχιερέως",
        //     "Πατριάρχῃ": "Ἀρχιερεῖ",
        //     "Patriarch": "Hierarch"
        // },

        "metropolitan": {
            "Ἀρχιερεὺς": "Μητροπολίτης",
            "Ἀρχιερεύς": "Μητροπολίτης",
            "Ἀρχιερέα": "Μητροπολίτην",
            "Ἀρχιερέως": "Μητροπολίτου",
            "Ἀρχιερεῖ": "Μητροπολίτῃ",
            "Hierarch": "Metropolitan",

            "Ἀρχιεπίσκοπος": "Μητροπολίτης",
            "Ἀρχιεπίσκοπον": "Μητροπολίτην",
            "Ἀρχιεπισκόπου": "Μητροπολίτου",
            "Ἀρχιεπισκόπῳ": "Μητροπολίτῃ",
            "Archbishop": "Metropolitan",

            "Ἐπίσκοπος": "Μητροπολίτης",
            "Ἐπίσκοπον": "Μητροπολίτην",
            "Ἐπισκόπου": "Μητροπολίτου",
            "Ἐπισκόπῳ": "Μητροπολίτῃ",
            "Bishop": "Metropolitan",

            "Πατριάρχης": "Μητροπολίτης",
            "Πατριάρχην": "Μητροπολίτην",
            "Πατριάρχου": "Μητροπολίτου",
            "Πατριάρχῃ": "Μητροπολίτῃ",
            "Patriarch": "Metropolitan"
        },

        "patriarch": {
            "Ἀρχιερεὺς": "Πατριάρχης",
            "Ἀρχιερεύς": "Πατριάρχης",
            "Ἀρχιερέα": "Πατριάρχην",
            "Ἀρχιερέως": "Πατριάρχου",
            "Ἀρχιερεῖ": "Πατριάρχῃ",
            "Hierarch": "Patriarch",

            "Ἀρχιεπίσκοπος": "Πατριάρχης",
            "Ἀρχιεπίσκοπον": "Πατριάρχην",
            "Ἀρχιεπισκόπου": "Πατριάρχου",
            "Ἀρχιεπισκόπῳ": "Πατριάρχῃ",
            "Archbishop": "Patriarch",

            "Ἐπίσκοπος": "Πατριάρχης",
            "Ἐπίσκοπον": "Πατριάρχην",
            "Ἐπισκόπου": "Πατριάρχου",
            "Ἐπισκόπῳ": "Πατριάρχῃ",
            "Bishop": "Patriarch",

            "Μητροπολίτης": "Πατριάρχης",
            "Μητροπολίτην": "Πατριάρχην",
            "Μητροπολίτου": "Πατριάρχου",
            "Μητροπολίτῃ": "Πατριάρχῃ",
            "Metropolitan": "Patriarch",

        }
    }

};