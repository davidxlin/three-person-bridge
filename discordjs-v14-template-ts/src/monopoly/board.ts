import { Tile, GoTile, CommunityChestTile, PropertyTile, ChanceTile, JailTile, FreeParkingTile, GoToJailTile, UtilityTile, RailroadTile, ColorTile, TaxTile } from './Tile'
import { Card, ChanceCard, CommunityChestCard } from './Card'
import { Player } from './Player'
import { ActivityFlagsBitField } from 'discord.js'
const json = JSON.parse( 
`{
    "properties": [
      {
        "name": "Mediterranean Avenue",
        "id": "mediterraneanave",
        "posistion": 2,
        "price": 60,
        "rent": 2,
        "multpliedrent": [
          10,
          30,
          90,
          160,
          250
        ],
        "housecost": 50,
        "group": "Purple",
        "ownedby": -1,
        "buildings": 0,
        "mortgaged": false,
        "probability": 2.1314,
        "rel": {
          "Square": "Mediterranean Avenue",
          "Probability % (Jail Short)": 2.1314,
          "Rank": 36,
          "Probability % (Jail Long)": 2.0073
        },
        "ohousecost": 50,
        "oprice": 60,
        "averageProbability": 2.06935
      },
      {
        "name": "Baltic Avenue",
        "id": "balticave",
        "posistion": 4,
        "price": 60,
        "rent": 4,
        "multpliedrent": [
          20,
          60,
          180,
          320,
          450
        ],
        "housecost": 50,
        "group": "Purple",
        "ownedby": -1,
        "buildings": 0,
        "mortgaged": false,
        "probability": 2.1624,
        "rel": {
          "Square": "Baltic Avenue",
          "Probability % (Jail Short)": 2.1624,
          "Rank": 35,
          "Probability % (Jail Long)": 2.0369
        },
        "ohousecost": 50,
        "oprice": 60,
        "averageProbability": 2.09965
      },
      {
        "name": "Oriental Avenue",
        "id": "orientalave",
        "posistion": 7,
        "price": 100,
        "rent": 6,
        "multpliedrent": [
          30,
          90,
          270,
          400,
          550
        ],
        "housecost": 50,
        "group": "lightgreen",
        "ownedby": -1,
        "buildings": 0,
        "mortgaged": false,
        "rel": {
          "Square": "Oriental Avenue",
          "Probability % (Jail Short)": 2.2621,
          "Rank": 32,
          "Probability % (Jail Long)": 2.1317
        },
        "ohousecost": 50,
        "oprice": 100,
        "averageProbability": 2.1969000000000003
      },
      {
        "name": "Vermont Avenue",
        "id": "vermontave",
        "posistion": 9,
        "price": 100,
        "rent": 6,
        "multpliedrent": [
          30,
          90,
          270,
          400,
          550
        ],
        "housecost": 50,
        "group": "lightgreen",
        "ownedby": -1,
        "buildings": 0,
        "mortgaged": false,
        "rel": {
          "Square": "Vermont Avenue",
          "Probability % (Jail Short)": 2.321,
          "Rank": 28,
          "Probability % (Jail Long)": 2.1874
        },
        "ohousecost": 50,
        "oprice": 100,
        "averageProbability": 2.2542
      },
      {
        "name": "Connecticut Avenue",
        "id": "connecticutave",
        "posistion": 10,
        "price": 120,
        "rent": 8,
        "multpliedrent": [
          40,
          100,
          300,
          450,
          600
        ],
        "housecost": 50,
        "group": "lightgreen",
        "ownedby": -1,
        "buildings": 0,
        "mortgaged": false,
        "rel": {
          "Square": "Connecticut Avenue",
          "Probability % (Jail Short)": 2.3003,
          "Rank": 30,
          "Probability % (Jail Long)": 2.168
        },
        "ohousecost": 50,
        "oprice": 120,
        "averageProbability": 2.23415
      },
      {
        "name": "St. Charles Place",
        "id": "stcharlesplace",
        "posistion": 12,
        "price": 140,
        "rent": 10,
        "multpliedrent": [
          50,
          150,
          450,
          625,
          750
        ],
        "housecost": 100,
        "group": "Violet",
        "ownedby": -1,
        "buildings": 0,
        "mortgaged": false,
        "rel": {
          "Square": "St. Charles Place",
          "Probability % (Jail Short)": 2.7017,
          "Rank": 15,
          "Probability % (Jail Long)": 2.556
        },
        "ohousecost": 100,
        "oprice": 140,
        "averageProbability": 2.62885
      },
      {
        "name": "States Avenue",
        "id": "statesave",
        "posistion": 14,
        "price": 140,
        "rent": 10,
        "multpliedrent": [
          50,
          150,
          450,
          625,
          750
        ],
        "housecost": 100,
        "group": "Violet",
        "ownedby": -1,
        "buildings": 0,
        "mortgaged": false,
        "rel": {
          "Square": "States Avenue",
          "Probability % (Jail Short)": 2.3721,
          "Rank": 29,
          "Probability % (Jail Long)": 2.1741
        },
        "ohousecost": 100,
        "oprice": 140,
        "averageProbability": 2.2731000000000003
      },
      {
        "name": "Virginia Avenue",
        "id": "virginiaave",
        "posistion": 15,
        "price": 160,
        "rent": 12,
        "multpliedrent": [
          60,
          180,
          500,
          700,
          900
        ],
        "housecost": 100,
        "group": "Violet",
        "ownedby": -1,
        "buildings": 0,
        "mortgaged": false,
        "rel": {
          "Square": "Virginia Avenue",
          "Probability % (Jail Short)": 2.4649,
          "Rank": 22,
          "Probability % (Jail Long)": 2.4255
        },
        "ohousecost": 100,
        "oprice": 160,
        "averageProbability": 2.4452
      },
      {
        "name": "St. James Place",
        "id": "stjamesplace",
        "posistion": 17,
        "price": 180,
        "rent": 14,
        "multpliedrent": [
          70,
          200,
          550,
          750,
          950
        ],
        "housecost": 100,
        "group": "Orange",
        "ownedby": -1,
        "buildings": 0,
        "mortgaged": false,
        "rel": {
          "Square": "St. James Place",
          "Probability % (Jail Short)": 2.7924,
          "Rank": 9,
          "Probability % (Jail Long)": 2.6802
        },
        "ohousecost": 100,
        "oprice": 180,
        "averageProbability": 2.7363
      },
      {
        "name": "Tennessee Avenue",
        "id": "tennesseeave",
        "posistion": 19,
        "price": 180,
        "rent": 14,
        "multpliedrent": [
          70,
          200,
          550,
          750,
          950
        ],
        "housecost": 100,
        "group": "Orange",
        "ownedby": -1,
        "buildings": 0,
        "mortgaged": false,
        "rel": {
          "Square": "Tennessee Avenue",
          "Probability % (Jail Short)": 2.9356,
          "Rank": 6,
          "Probability % (Jail Long)": 2.821
        },
        "ohousecost": 100,
        "oprice": 180,
        "averageProbability": 2.8783000000000003
      },
      {
        "name": "New York Avenue",
        "id": "newyorkave",
        "posistion": 20,
        "price": 200,
        "rent": 16,
        "multpliedrent": [
          80,
          220,
          600,
          800,
          1000
        ],
        "housecost": 100,
        "group": "Orange",
        "ownedby": -1,
        "buildings": 0,
        "mortgaged": false,
        "rel": {
          "Square": "New York Avenue",
          "Probability % (Jail Short)": 3.0852,
          "Rank": 7,
          "Probability % (Jail Long)": 2.8118
        },
        "ohousecost": 100,
        "oprice": 200,
        "averageProbability": 2.9485
      },
      {
        "name": "Kentucky Avenue",
        "id": "kentuckyave",
        "posistion": 22,
        "price": 220,
        "rent": 18,
        "multpliedrent": [
          90,
          250,
          700,
          875,
          1050
        ],
        "housecost": 150,
        "group": "Red",
        "ownedby": -1,
        "buildings": 0,
        "mortgaged": false,
        "rel": {
          "Square": "Kentucky Avenue",
          "Probability % (Jail Short)": 2.8358,
          "Rank": 12,
          "Probability % (Jail Long)": 2.6143
        },
        "ohousecost": 150,
        "oprice": 220,
        "averageProbability": 2.72505
      },
      {
        "name": "Indiana Avenue",
        "id": "indianaave",
        "posistion": 24,
        "price": 220,
        "rent": 18,
        "multpliedrent": [
          90,
          250,
          700,
          875,
          1050
        ],
        "housecost": 150,
        "group": "Red",
        "ownedby": -1,
        "buildings": 0,
        "mortgaged": false,
        "rel": {
          "Square": "Indiana Avenue",
          "Probability % (Jail Short)": 2.7357,
          "Rank": 14,
          "Probability % (Jail Long)": 2.5671
        },
        "ohousecost": 150,
        "oprice": 220,
        "averageProbability": 2.6513999999999998
      },
      {
        "name": "Illinois Avenue",
        "id": "illinoisave",
        "posistion": 25,
        "price": 240,
        "rent": 20,
        "multpliedrent": [
          100,
          300,
          750,
          925,
          1100
        ],
        "housecost": 150,
        "group": "Red",
        "ownedby": -1,
        "buildings": 0,
        "mortgaged": false,
        "rel": {
          "Square": "Illinois Avenue",
          "Probability % (Jail Short)": 3.1858,
          "Rank": 2,
          "Probability % (Jail Long)": 2.9929
        },
        "ohousecost": 150,
        "oprice": 240,
        "averageProbability": 3.08935
      },
      {
        "name": "Atlantic Avenue",
        "id": "atlanticave",
        "posistion": 27,
        "price": 260,
        "rent": 22,
        "multpliedrent": [
          110,
          330,
          800,
          975,
          1150
        ],
        "housecost": 150,
        "group": "Yellow",
        "ownedby": -1,
        "buildings": 0,
        "mortgaged": false,
        "rel": {
          "Square": "Atlantic Avenue",
          "Probability % (Jail Short)": 2.7072,
          "Rank": 16,
          "Probability % (Jail Long)": 2.537
        },
        "ohousecost": 150,
        "oprice": 260,
        "averageProbability": 2.6220999999999997
      },
      {
        "name": "Ventnor Avenue",
        "id": "ventnorave",
        "posistion": 28,
        "price": 260,
        "rent": 22,
        "multpliedrent": [
          110,
          330,
          800,
          975,
          1150
        ],
        "housecost": 150,
        "group": "Yellow",
        "ownedby": -1,
        "buildings": 0,
        "mortgaged": false,
        "rel": {
          "Square": "Ventnor Avenue",
          "Probability % (Jail Short)": 2.6789,
          "Rank": 18,
          "Probability % (Jail Long)": 2.5191
        },
        "ohousecost": 150,
        "oprice": 260,
        "averageProbability": 2.599
      },
      {
        "name": "Marvin Gardens",
        "id": "marvingardens",
        "posistion": 30,
        "price": 280,
        "rent": 22,
        "multpliedrent": [
          120,
          360,
          850,
          1025,
          1200
        ],
        "housecost": 150,
        "group": "Yellow",
        "ownedby": -1,
        "buildings": 0,
        "mortgaged": false,
        "rel": {
          "Square": "Marvin Gardens",
          "Probability % (Jail Short)": 2.5861,
          "Rank": 21,
          "Probability % (Jail Long)": 2.4381
        },
        "ohousecost": 150,
        "oprice": 280,
        "averageProbability": 2.5121
      },
      {
        "name": "Pacific Avenue",
        "id": "pacificave",
        "posistion": 32,
        "price": 300,
        "rent": 26,
        "multpliedrent": [
          130,
          390,
          900,
          1100,
          1275
        ],
        "housecost": 200,
        "group": "darkgreen",
        "ownedby": -1,
        "buildings": 0,
        "mortgaged": false,
        "rel": {
          "Square": "Pacific Avenue",
          "Probability % (Jail Short)": 2.6774,
          "Rank": 17,
          "Probability % (Jail Long)": 2.5236
        },
        "ohousecost": 200,
        "oprice": 300,
        "averageProbability": 2.6005000000000003
      },
      {
        "name": "North Carolina Avenue",
        "id": "northcarolinaave",
        "posistion": 33,
        "price": 300,
        "rent": 26,
        "multpliedrent": [
          130,
          390,
          900,
          1100,
          1275
        ],
        "housecost": 200,
        "group": "darkgreen",
        "ownedby": -1,
        "buildings": 0,
        "mortgaged": false,
        "rel": {
          "Square": "North Carolina Avenue",
          "Probability % (Jail Short)": 2.6252,
          "Rank": 20,
          "Probability % (Jail Long)": 2.4721
        },
        "ohousecost": 200,
        "oprice": 300,
        "averageProbability": 2.5486500000000003
      },
      {
        "name": "Pennsylvania Avenue",
        "id": "pennsylvaniaave",
        "posistion": 35,
        "price": 320,
        "rent": 28,
        "multpliedrent": [
          150,
          450,
          1000,
          1200,
          1400
        ],
        "housecost": 200,
        "group": "darkgreen",
        "ownedby": -1,
        "buildings": 0,
        "mortgaged": false,
        "rel": {
          "Square": "Pennsylvania Avenue",
          "Probability % (Jail Short)": 2.5006,
          "Rank": 23,
          "Probability % (Jail Long)": 2.3531
        },
        "ohousecost": 200,
        "oprice": 320,
        "averageProbability": 2.42685
      },
      {
        "name": "Park Place",
        "id": "parkplace",
        "posistion": 38,
        "price": 350,
        "rent": 35,
        "multpliedrent": [
          175,
          500,
          1100,
          1300,
          1500
        ],
        "housecost": 200,
        "group": "darkblue",
        "ownedby": -1,
        "buildings": 0,
        "mortgaged": false,
        "rel": {
          "Square": "Park Place",
          "Probability % (Jail Short)": 2.1864,
          "Rank": 33,
          "Probability % (Jail Long)": 2.0595
        },
        "ohousecost": 200,
        "oprice": 350,
        "averageProbability": 2.12295
      },
      {
        "name": "Boardwalk",
        "id": "boardwalk",
        "posistion": 40,
        "price": 400,
        "rent": 50,
        "multpliedrent": [
          200,
          600,
          1400,
          1700,
          2000
        ],
        "housecost": 200,
        "group": "darkblue",
        "ownedby": -1,
        "buildings": 0,
        "mortgaged": false,
        "rel": {
          "Square": "Boardwalk",
          "Probability % (Jail Short)": 2.626,
          "Rank": 19,
          "Probability % (Jail Long)": 2.4832
        },
        "ohousecost": 200,
        "oprice": 400,
        "averageProbability": 2.5545999999999998
      },
      {
        "name": "Electric Company",
        "id": "electriccompany",
        "posistion": 13,
        "price": 150,
        "group": "Utilities",
        "ownedby": -1,
        "mortgaged": false,
        "rel": {
          "Square": "Electric Company",
          "Probability % (Jail Short)": 2.604,
          "Rank": 13,
          "Probability % (Jail Long)": 2.614
        },
        "oprice": 150,
        "averageProbability": 2.609
      },
      {
        "name": "Water Works",
        "id": "waterworks",
        "posistion": 29,
        "price": 150,
        "group": "Utilities",
        "ownedby": -1,
        "mortgaged": false,
        "rel": {
          "Square": "Water Works",
          "Probability % (Jail Short)": 2.8074,
          "Rank": 10,
          "Probability % (Jail Long)": 2.6507
        },
        "oprice": 150,
        "averageProbability": 2.72905
      },
      {
        "name": "Reading Railroad",
        "id": "readingrailroad",
        "posistion": 6,
        "price": 200,
        "group": "Railroad",
        "ownedby": -1,
        "mortgaged": false,
        "probability": 2.1314,
        "rel": {
          "Square": "Reading Railroad",
          "Probability % (Jail Short)": 2.9631,
          "Rank": 8,
          "Probability % (Jail Long)": 2.801
        },
        "oprice": 200,
        "averageProbability": 2.88205
      },
      {
        "name": "Pennsylvania Railroad",
        "id": "pennsylvaniarailroad",
        "posistion": 16,
        "price": 200,
        "group": "Railroad",
        "ownedby": -1,
        "mortgaged": false,
        "rel": {
          "Square": "Pennsylvania Railroad",
          "Probability % (Jail Short)": 2.92,
          "Rank": 11,
          "Probability % (Jail Long)": 2.6354
        },
        "oprice": 200,
        "averageProbability": 2.7777000000000003
      },
      {
        "name": "B. & O. Railroad",
        "id": "borailroad",
        "posistion": 26,
        "price": 200,
        "group": "Railroad",
        "ownedby": -1,
        "mortgaged": false,
        "oprice": 200,
        "averageProbability": 2.975
      },
      {
        "name": "Short Line Railroad",
        "id": "shortlinerailroad",
        "posistion": 36,
        "price": 200,
        "group": "Railroad",
        "ownedby": -1,
        "mortgaged": false,
        "oprice": 200,
        "averageProbability": 2.3609500000000002
      },
      {
        "name": "Go",
        "id": "go",
        "posistion": 0,
        "group": "Special",
        "rel": {
          "Square": "Go",
          "Probability % (Jail Short)": 3.0961,
          "Rank": 3,
          "Probability % (Jail Long)": 2.9143
        },
        "averageProbability": 3.0052
      },
      {
        "name": "Income Tax",
        "id": "incometax",
        "group": "Special",
        "rel": {
          "Square": "Income Tax",
          "Probability % (Jail Short)": 2.3285,
          "Rank": 27,
          "Probability % (Jail Long)": 2.1934
        },
        "averageProbability": 2.2609500000000002
      },
      {
        "name": "Jail / Just Visiting",
        "id": "jail",
        "posistion": 10,
        "group": "Special",
        "averageProbability": 8.897
      },
      {
        "name": "Chance",
        "id": "chance",
        "group": "Special",
        "rel": {
          "Square": "Chance",
          "Probability % (Jail Short)": 0.865,
          "Rank": 40,
          "Probability % (Jail Long)": 0.8152
        },
        "averageProbability": 0.8401000000000001
      },
      {
        "name": "Free Parking",
        "id": "freeparking",
        "group": "Special",
        "rel": {
          "Square": "Free Parking",
          "Probability % (Jail Short)": 2.8836,
          "Rank": 5,
          "Probability % (Jail Long)": 2.8253
        },
        "averageProbability": 2.85445
      },
      {
        "name": "Community Chest",
        "id": "communitychest",
        "group": "Special",
        "rel": {
          "Square": "Community Chest",
          "Probability % (Jail Short)": 1.8849,
          "Rank": 37,
          "Probability % (Jail Long)": 1.775
        },
        "averageProbability": 1.82995
      },
      {
        "name": "Go To Jail",
        "id": "gotojail",
        "group": "Special",
        "rel": {
          "Square": "Go To Jail",
          "Probability % (Jail Short)": 0,
          "Rank": 41,
          "Probability % (Jail Long)": 0
        },
        "averageProbability": 0
      },
      {
        "name": "Luxury Tax",
        "id": "luxerytax",
        "group": "Special",
        "averageProbability": 2.116
      }
    ],
    "tiles": [
      {"id": "go"},
      {"id": "mediterraneanave"},
      {"id": "communitychest"},
      {"id": "balticave"},
      {"id": "incometax"},
      {"id": "readingrailroad"},
      {"id": "orientalave"},
      {"id": "chance"},
      {"id": "vermontave"},
      {"id": "connecticutave"},
      {"id": "jail"},
      {"id": "stcharlesplace"},
      {"id": "electriccompany"},
      {"id": "statesave"},
      {"id": "virginiaave"},
      {"id": "pennsylvaniarailroad"},
      {"id": "stjamesplace"},
      {"id": "communitychest"},
      {"id": "tennesseeave"},
      {"id": "newyorkave"},
      {"id": "freeparking"},
      {"id": "kentuckyave"},
      {"id": "chance"},
      {"id": "indianaave"},
      {"id": "illinoisave"},
      {"id": "borailroad"},
      {"id": "atlanticave"},
      {"id": "ventnorave"},
      {"id": "waterworks"},
      {"id": "marvingardens"},
      {"id": "gotojail"},
      {"id": "pacificave"},
      {"id": "northcarolinaave"},
      {"id": "communitychest"},
      {"id": "pennsylvaniaave"},
      {"id": "shortlinerailroad"},
      {"id": "chance"},
      {"id": "parkplace"},
      {"id": "luxerytax"},
      {"id": "boardwalk"}
    ],
    "chance": [
      {
        "title": "Advance to Go (Collect $200)",
        "action": "move",
        "tileid": "go"
      },
      {
        "title": "Advance to Illinois Avenue - If you pass Go, collect $200",
        "action": "move",
        "tileid": "illinoiseave"
      },
      {
        "title": "Advance to St. Charles Place - If you pass Go, collect $200",
        "action": "move",
        "tileid": "stcharlesplace"
      },
      {
        "title": "Advance token to nearest Utility. If unowned, you may buy it from the Bank. If owned, throw dice and pay owner a total ten times the amount thrown.",
        "action": "movenearest",
        "groupid": "utility",
        "rentmultiplier": 10
      },
      {
        "title": "Advance token to the nearest Railroad and pay owner twice the rental to which he/she is otherwise entitled. If Railroad is unowned, you may buy it from the Bank.",
        "action": "movenearest",
        "groupid": "railroad",
        "rentmultiplier": 2
      },
      {
        "title": "Bank pays you dividend of $50",
        "action": "addfunds",
        "amount": 50
      },
      {
        "title": "Get out of Jail Free - This card may be kept until needed, or traded/sold",
        "action": "jail",
        "subaction": "getout"
      },
      {
        "title": "Go Back 3 Spaces",
        "action": "move",
        "count": -3
      },
      {
        "title": "Go to Jail - Go directly to Jail - Do not pass Go, do not collect $200",
        "action": "jail",
        "subaction": "goto"
      },
      {
        "title": "Make general repairs on all your property - For each house pay $25 - For each hotel $100",
        "action": "propertycharges",
        "buildings": 25,
        "hotels": 100
      },
      {
        "title": "Pay poor tax of $15",
        "action": "removefunds",
        "amount": 15
      },
      {
        "title": "Take a trip to Reading Railroad - If you pass Go, collect $200",
        "action": "move",
        "tileid": "readingrailroad"
      },
      {
        "title": "Take a walk on the Boardwalk - Advance token to Boardwalk",
        "action": "move",
        "tileid": "boardwalk"
      },
      {
        "title": "You have been elected Chairman of the Board - Pay each player $50",
        "action": "removefundstoplayers",
        "amount": 50
      },
      {
        "title": "Your building loan matures - Collect $150",
        "action": "addfunds",
        "amount": 50
      }
    ],
    "communitychest": [
      {
        "title": "Advance to Go (Collect $200)",
        "action": "move",
        "tileid": "go"
      },
      {
        "title": "Bank error in your favor - Collect $200 ",
        "action": "addfunds",
        "amount": 200
      },
      {
        "title": "Doctor fee - Pay $50",
        "action": "removefunds",
        "amount": 50
      },
      {
        "title": "From sale of stock you get $50",
        "action": "addfunds",
        "amount": 50
      },
      {
        "title": "Get Out of Jail Free",
        "action": "jail",
        "subaction": "getout"
      },
      {
        "title": "Go to Jail - Go directly to jail - Do not pass Go - Do not collect $200",
        "action": "jail",
        "subaction": "goto"
      },
      {
        "title": "Grand Opera Night - Collect $50 from every player for opening night seats",
        "action": "addfundsfromplayers",
        "amount": 50
      },
      {
        "title": "Holiday Fund matures - Receive $100",
        "action": "addfunds",
        "amount": 100
      },
      {
        "title": "Income tax refund - Collect $20",
        "action": "addfunds",
        "amount": 20
      },
      {
        "title": "Life insurance matures - Collect $100",
        "action": "addfunds",
        "amount": 100
      },
      {
        "title": "Pay hospital fees of $100",
        "action": "removefunds",
        "amount": 100
      },
      {
        "title": "Pay school fees of $150",
        "action": "removefunds",
        "amount": 150
      },
      {
        "title": "Receive $25 consultancy fee",
        "action": "addfunds",
        "amount": 25
      },
      {
        "title": "You are assessed for street repairs - $40 per house - $115 per hotel",
        "action": "propertycharges",
        "buildings": 40,
        "hotels": 115
      },
      {
        "title": "You have won second prize in a beauty contest - Collect $10",
        "action": "addfunds",
        "amount": 10
      },
      {
        "title": "You inherit $100",
        "action": "addfunds",
        "amount": 100
      }
    ]
  }`
)

class Board {
    private tiles: Tile[]
    private chance: ChanceCard[]
    private communityChest: CommunityChestCard[]
    private players: Player[] = []

    constructor() {
        this.tiles = json.tiles.map((info: any, i: number) => {
            const id: string = info.id
            const property: any = json.properties.find((property: any) => property.id == id)
            const name: string = property.name
            if (name == 'Go') {
                return new GoTile(name, i)
            } else if (name == 'Community Chest') {
                return new CommunityChestTile(name, i)
            } else if (name == 'Chance') {
                return new ChanceTile(name, i)
            } else if (name == 'Jail / Just Visiting') {
                return new JailTile(name, i)
            } else if (name == 'Free Parking') {
                return new FreeParkingTile(name, i)
            } else if (name == 'Go To Jail') {
                return new GoToJailTile(name, i)
            } else if (name == 'Income Tax') {
                return new TaxTile(name, i, 200)
            } else if (name == 'Luxury Tax') {
                return new TaxTile(name, i, 100)
            } else if (property.hasOwnProperty('group')) {
                const group: string = property.group
                const price: number = property.price
                if (group == 'Utilities') {
                    return new UtilityTile(name, i, price)
                } else if (group == 'Railroad') {
                    return new RailroadTile(name, i, price)
                } else {
                    // Color Tile
                    const color: string = group
                    const rent: number[] = property.multpliedrent
                    const houseCost = property.housecost
                    return new ColorTile(name, i, price, color, rent, houseCost)
                }
            }
        })
        this.chance = json.chance.map((e: any) => new ChanceCard(e.title))
        this.communityChest = json.communitychest.map((e: any) => new CommunityChestCard(e.title))
    }

    public getTileNames(): string[] {
      return this.tiles.map(tile => tile.name)
    }

    public getTileByName(name: string): Tile | undefined {
      return this.tiles.find(tile => tile.name == name)
    }

    public getChanceDescriptions(): string[] {
      return this.chance.map(chance => chance.description).sort()
    }

    public getCommunityChestDescriptions(): string[] {
      return this.communityChest.map(communityChest => communityChest.description).sort()
    }

    private drawCard(cards: Card[]) {
      const card = cards[cards.length - 1]
      cards.pop()
      cards.unshift(card)
      return card
    }

    public drawChance(): Card {
      return this.drawCard(this.chance)
    }

    public drawCommunityChest(): Card {
      return this.drawCard(this.communityChest)
    }

    public diceRoll(): number[] {
      const dice1 = Math.floor(Math.random() * 6) + 1
      const dice2 = Math.floor(Math.random() * 6) + 1
      return dice1 < dice2 ? [dice1, dice2] : [dice2, dice1]
    }

    public addPlayer(name: string) {
      const shuffleArray = (array: Object[]) => {
          for (let i = array.length - 1; i > 0; i--) {
              const j = Math.floor(Math.random() * (i + 1));
              const temp = array[i];
              array[i] = array[j];
              array[j] = temp;
          }
      }
      shuffleArray(this.chance)
      shuffleArray(this.communityChest)

      this.players.push(new Player(name))
    }

    public getPlayerByName(name: string): Player | undefined {
      return this.players.find(player => player.name == name)
    }

    public addMoney(playerName: string, amount: number): boolean {
      const player = this.getPlayerByName(playerName)
      if (!player) {
        return false
      }
      player.money += amount
      return true
    }

    public addProperty(playerName: string, propertyName: string): boolean {
      const player = this.getPlayerByName(playerName)
      const property = this.getTileByName(propertyName)
      if (!player || !(property instanceof PropertyTile)) {
        return false
      }
      player.properties.push(property)
      return true
    }

    public removeProperty(playerName: string, propertyName: string): boolean {
      const player = this.getPlayerByName(playerName)
      const property = this.getTileByName(propertyName)
      if (!player || !(property instanceof PropertyTile)) {
        return false
      }
      const index = player.properties.indexOf(property)
      if (index == -1) {
        return false
      }
      player.properties.splice(index, 1)
      return true
    }

    public addGetOutOfJailFreeCards(playerName: string, quantity: number) {
      const player = this.getPlayerByName(playerName)
      if (!player) {
        return false
      }
      player.numGetOutOfJailFreeCards += quantity
      return true
    }

    public toString(): string {
      return `${this.tiles}`
    }

    public setPosition(playerName: string, position: string): boolean {
      const player = this.getPlayerByName(playerName)
      if (!player) {
        return false
      }
      player.position = position
      return true
    }

    public setMortgaged(propertyName: string, mortgaged: boolean): boolean {
      const property = this.getTileByName(propertyName)
      if (!(property instanceof PropertyTile)) {
        return false
      }
      property.mortgaged = mortgaged
      return true
    }

    public setNumHouses(propertyName: string, numHouses: number): boolean {
      const property = this.getTileByName(propertyName)
      if (!(property instanceof ColorTile)) {
        return false
      }
      property.numHouses = numHouses
      return true
    }
}

const board = new Board()
export default board