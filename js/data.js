const continents = [
    {
        name: "Carlos's Corner",
        areas: ["c1", "c2", "c3", "c4"],
        bonus: 2
    }, 
    {
        name: "Sam's Stairwell",
        areas: ["s1", "s2", "s3"],
        bonus: 1
    }, 
    {
        name: "Josh's Jail Cells",
        areas: ["j1", "j2", "j3", "j4", "j5"],
        bonus: 3
    }, 
    {
        name: "Ryan's Rec Room",
        areas: ["ry1", "ry2"],
        bonus: 1
    },
    {
        name: "Gabriel's Great Room",
        areas: ["g1", "g2"],
        bonus: 1
    },
    {
        name: "Alvin's Atrium",
        areas: ["a1", "a2", "a3", "a4"],
        bonus: 4
    }, 
    {
        name: "Wendy's Workroom",
        areas: ["w1", "w2"],
        bonus: 1
    }, 
    {
        name: "Diani's Den",
        areas: ["d1", "d2"],
        bonus: 1
    }, 
    {
        name: "Michel's Mezzanine",
        areas: ["m1", "m2", "m3"],
        bonus: 3
    },
    {
        name: "Ruth's Rumpus Room",
        areas: ["ru1", "ru2"],
        bonus: 2
    }  
]

const territories = [
    { "name": "c1", "continent": "Carlos's Corner", "owner": "none", "color": "white", "army": 3, "neighbors": ["c2", "c3"]},
    { "name": "c2", "continent": "Carlos's Corner", "owner": "none", "color": "white", "army": 3, "neighbors": ["c1", "c3", "c4"]},
    { "name": "c3", "continent": "Carlos's Corner", "owner": "none", "color": "white", "army": 3, "neighbors": ["c1", "c2", "c4"]},
    { "name": "c4", "continent": "Carlos's Corner", "owner": "none", "color": "white", "army": 3, "neighbors": ["a1", "c2", "c3"]},
    { "name": "s1", "continent": "Sam's Stairwell", "owner": "none", "color": "white", "army": 3, "neighbors": ["s2", "s3"]},
    { "name": "s2", "continent": "Sam's Stairwell", "owner": "none", "color": "white", "army": 3, "neighbors": ["s1"]},
    { "name": "s3", "continent": "Sam's Stairwell", "owner": "none", "color": "white", "army": 3, "neighbors": ["s1", "a2", "a3"]},
    { "name": "j1", "continent": "Josh's Jail Cells", "owner": "none", "color": "white", "army": 3, "neighbors": ["ry1"]},
    { "name": "j2", "continent": "Josh's Jail Cells", "owner": "none", "color": "white", "army": 3, "neighbors": ["j3", "j4", "j5"]},
    { "name": "j3", "continent": "Josh's Jail Cells", "owner": "none", "color": "white", "army": 3, "neighbors": ["j2", "j4", "j5"]},
    { "name": "j4", "continent": "Josh's Jail Cells", "owner": "none", "color": "white", "army": 3, "neighbors": ["j2", "j3", "j5", "a3"]},
    { "name": "j5", "continent": "Josh's Jail Cells", "owner": "none", "color": "white", "army": 3, "neighbors": ["j2", "j3", "j4", "m1", "ry2"]},
    { "name": "ry1", "continent": "Ryan's Rec Room", "owner": "none", "color": "white", "army": 3, "neighbors": ["j1", "ry2"]},
    { "name": "ry2", "continent": "Ryan's Rec Room", "owner": "none", "color": "white", "army": 3, "neighbors": ["ry1", "j5", "m1", "g2"]},
    { "name": "g1", "continent": "Gabriel's Great Room", "owner": "none", "color": "white", "army": 3, "neighbors": ["g2"]},
    { "name": "g2", "continent": "Gabriel's Great Room", "owner": "none", "color": "white", "army": 3, "neighbors": ["g1", "ry2", "m1", "ru1"]},
    { "name": "a1", "continent": "Alvin's Atrium", "owner": "none", "color": "white", "army": 3, "neighbors": ["a2", "c4", "w1", "d1"]},
    { "name": "a2", "continent": "Alvin's Atrium", "owner": "none", "color": "white", "army": 3, "neighbors": ["a1", "a3", "a4", "s3", "d1"]},
    { "name": "a3", "continent": "Alvin's Atrium", "owner": "none", "color": "white", "army": 3, "neighbors": ["a2", "a4", "s3", "j4", "m1"]},
    { "name": "a4", "continent": "Alvin's Atrium", "owner": "none", "color": "white", "army": 3, "neighbors": ["a2", "a3", "d1", "m1"]},
    { "name": "w1", "continent": "Wendy's Workroom", "owner": "none", "color": "white", "army": 3, "neighbors": ["w2", "a1", "d1"]},
    { "name": "w2", "continent": "Wendy's Workroom", "owner": "none", "color": "white", "army": 3, "neighbors": ["w1"]},
    { "name": "d1", "continent": "Diani's Den", "owner": "none", "color": "white", "army": 3, "neighbors": ["d2", "a1", "a2", "a4", "w1"]},
    { "name": "d2", "continent": "Diani's Den", "owner": "none", "color": "white", "army": 3, "neighbors": ["d1"]},
    { "name": "m1", "continent": "Michel's Mezzanine", "owner": "none", "color": "white", "army": 3, "neighbors": ["m2", "m3", "a3", "a4", "j5", "ry2", "g2", "ru1"]},
    { "name": "m2", "continent": "Michel's Mezzanine", "owner": "none", "color": "white", "army": 3, "neighbors": ["m1", "m3"]},
    { "name": "m3", "continent": "Michel's Mezzanine", "owner": "none", "color": "white", "army": 3, "neighbors": ["m1", "m2"]},
    { "name": "ru1", "continent": "Ruth's Rumpus Room", "owner": "none", "color": "white", "army": 3, "neighbors": ["ru2", "g2", "m1"]},
    { "name": "ru2", "continent": "Ruth's Rumpus Room", "owner": "none", "color": "white", "army": 3, "neighbors": ["ru1"]}
]