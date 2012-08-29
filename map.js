/*
*       traps
123     switches
hjk     door open
HJK     door closed
        empty space
X       wall
x       wall secret
#       rock
.       floor
$       gold
*/

mapdata = {

    map: [
        "                                                                                                                                         ",
        "                                                                     ##########                                                          ",
        "                                                                   ##..........#                                                         ",
        "                                                                  #............ #                                                        ",
        "                                                                 #............$..###                                                     ",
        "                                                                 #..................#                                                    ",
        "                                                               ## ..................#                                                    ",
        "                                                      #########.....................#                                                    ",
        "                                                     #...............................#                                                   ",
        "                                                    #................................#                                                   ",
        "                                  XXXXXXXXXXXXXXXXXXX................................#                                                   ",
        "                                  X....................$..............................#                                                  ",
        "                                  X.XXXXXXXXXXXXXXXXX.................................#                                                  ",
        "                                  X.X...............#................................#                                                   ",
        "                                  X.X................#..............................#                                                    ",
        "                                  X.X.................#............X..........*....#                                                     ",
        "                                  X.X..................##.......$..X..............#                                                      ",
        "                                  X.X...................#X.X###....X.X............#                                                      ",
        "                                  X.X........$...........X.X   ##..X.X.........###                                                       ",
        "                                  X.X........*...........X.X     ##X.X.....####                                                          ",
        "                                  X.X......$*$...........X.X       X.X...##                                                              ",
        "                                  X.x.......$.$..........X.X       X.X###     ####                                                       ",
        "                                  X.X.........*$.........X.X       X.X      ##....#                                                      ",
        "                                  X.X.........$..........X.X       X.X     #.......#                                                     ",
        "                                  X.X....................X.X  XXXXXX.XXXXXX.........#                                                    ",
        "                                  X.X....................X.X  X....X.X....x.........#                                                    ",
        "                                  X.X....................X.X  X.$..H.H..$.X.........#                                                    ",
        "                                  X.X....................X.X  X....X.X....X.........#                                                    ",
        "                                  X.X....................X.X  XXXXXX.XXXXXX.........#                                                    ",
        "                                  X.XXXXXXXXXXXXXXXXXXXXXX.X       X.X     #.........##            XXXXXXXXXXXX                          ",
        "                                  X........................X       X.X      #####......#           X..........X                          ",
        "                                  XXXXXXXXXXXXXXXXXXXXXXXXXX  XXXXXX.XXXXXX      #......#          X..........X                          ",
        "                                                              X....X.X....X      #.......#         X..........X                          ",
        "                                                              X....H.H..$.X      #........#        X...XXXX...X                          ",
        "                                                              X....X.X....X      #........XXXXXXXXXX...X2.X...XXXXXXXXXXXXXXXXXXXXXXXXX  ",
        "           ######                                             XXXXXX.XXXXXX      #.....................X..X...j......................*#  ",
        "          #......###                                               X X            #..$....XXXXXXXXXX...X..X...XXXXXJXXXXXXXXXX.XXXXXXX   ",
        "         #..........#                                              X.X            #......#         X...XX.X...X   X.X        X.X         ",
        "         #....$......##                                            X.X             ##...#          X..........X   X.X        X.X         ",
        "         #.............#                                           X.X               ###           X..........X   X.X        X.X         ",
        "        #..............#                                           X.X                             X..........X   X.X        X.X         ",
        "        #...............#                                          X$X                             XXXXXJJXXXXX   X.X        X.X         ",
        "        #...............#                                    XXXXXXXxXXXXXXX                           X  X       X.X        X.X         ",
        "       #..............XXXXXXXXXXXXXXXXXXXX                   X.............X                           X  X       X.X        X.X         ",
        "       #.............#....X....X....X....X                   X.............X                           X  X       X.X        X.X         ",
        "      #..............#.**.X....X.$..X....X                   X.............X     X                     X  X       X.X        X.X         ",
        "     #............$.$#....X....X....X....X                   X.............X    X.X                    X  X       X.X        X.X         ",
        "     #..........*..##....................XXXXXXXXXXXXXXXXXXXXX....XXXXX..$.XXXXX...X                   X  X       X.X        X.X         ",
        "    #............$#.............................................XXX........K....$.$.X               XXXX  XXXX    X.X        X.X         ",
        "   #.............#..$.......................*.$...................X........K$........X              X........X  XXX.XXX      X.X         ",
        "   #............#.................................................X........K....$.$.X               X.XXXXXX.XXXX.....XXXXXXXX.X         ",
        "  #.............K........................XXXXXXXXXXXXXXXXXXXXX....XXXXX....XXXXX...X                X.X....X...*...2...........X         ",
        "  #.......X.....#........................X                   X.............X    X.X                 X.X$.X.X.XXXX.....XXXXXXXX.X         ",
        "  #.......X......#...X....X....X....X....X                   X.............X     X                  X.XXXX.X.X  XX...XX      X.X         ",
        " #........X.X.....#..X....X.**.X....X....X                   X.............X       ########         X........X   X...X       X.X         ",
        " #........X.X.....#..X....X$...X....X....X###                X.............X      #........#        XXXXXXXXXX   X...X       X.X         ",
        " #........X.X......XXXXKKXXXXXXXXXXXXXXXXX...#               XXXXXXX.XXXXXXX     #..........#                    X...X       X.X         ",
        " #....$...X.X......*..............$..*........#                    X.X           #...$......#                    X...X    ###X.X         ",
        "  #.......X.X.......................*..XXX.....##                  X.X         ##............###                 X...X  ##...X.X         ",
        "   #......X.XXXXX..XXXXXXXXXXXXXXXXX..X...X......#                 X.X        #.................#                X...X #.....X.X         ",
        "   #......X........*...............X..X.$..XXX$...#               X...X      #...................##              X...X#.....XX.XX        ",
        "    #.....XXXKKXXXXXXXXX..XXXXXXXX.X..X.......X...#              X.....X     #.....................#             X...X......X...X###     ",
        "     #....#......................X.X...XX......X..#              X..1..X    #.......................#####        X...X......X.$.X...#    ",
        "      #..#....................$..X.X.....X..1..X..#              X.....X    #............................#       X...X......X...X....#   ",
        "      #..#.........................X...XX......X..#               X...X     #.............................#      X...X......XXxXX....#   ",
        "       ##........................XhX..........X...#                XXX       #............................#      X...X................#  ",
        "         #.......................X.X.X.....XXX...#                            #............................######X...X................#  ",
        "         #.......................X.X.X..3..X.....#                             #..............*..................X...X.................# ",
        "          ##.....................X.X.X.....X...##.                             #.................................X...X.................# ",
        "            #....................X.X..X...X...#                                 #..................###...........X...X.................# ",
        "             ##########..........X.X...XXX...#                                   #................#   #..........X...X.................# ",
        "                       ##........X.X........#                                    #......$.......##    #..........X...X.................# ",
        "                         ##......X.x.....###                               ###  #...##.........#     #...........X...X.................# ",
        "                           ####..*.x...##                                ##...##...#  #########     #............X...X.................# ",
        "                               ##X.X###                                ##.........#                #.............X...X.................# ",
        "                                 X.X                                   #.........#                 #.............X...X.................# ",
        "                                 X.X                                  #.........#                  #..............#*.X................#  ",
        "                                 X.X                                 #..........#                  #...............##.................#  ",
        "                                 X.X                                 #..........#                  #.................................#   ",
        "                                 X.XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX*......2#$..#                 #.................................#   ",
        "                                 X.x................................H.............#                #.................................#   ",
        "                                 XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX.............#                 #.........................$.....#    ",
        "                                                                    #.............#                  ##$...........................#     ",
        "                                                                     #...........#                     #...........................#     ",
        "                                                                      ######....#                       ###........................#     ",
        "                                                                            ####                           ###....................#      ",
        "                                                                                                              ##...............###       ",
        "                                                                                                                ####........###          ",
        "                                                                                                                    ########             ",
        "                                                                                                                                         "
    ],
    
    "size": {"x": 137, "y": 90},
    
    "origin": {"x": 69, "y": 49}
	
}