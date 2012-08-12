/*
abcd    traps inactive
ABCD    traps active
hjkl    door open
HJKL    door closed
1234    switches
        empty space
X       wall
x       wall secret
.       floor
$       gold
@       player
???     monsters
*/

mapdata = {

    map: [
        "        XXXXXXXXXXXXXXXXXXXXXXXX",
        "        X......................X",
        "        X......................X",
        "        X......................X",
        "        X......................X",
        "        X......................X",
        "        X......................X",
        "        X......................X",
        "        X......................X",
        "        XXXXXXXXXXXXXXXXXXXXxXXX",
        "                           x.x  ",
        "                         XXX.XXX",
        "                         X.....X",
        "                         X.....X",
        "                         X.....X",
        "                         XXXXXXX"
    ],
    
    "size": {"x": 32, "y": 16},
    
    "origin": {"x": 12, "y": 3},
	
	"scroll": {"x": 20, "y": 20}
	
}
