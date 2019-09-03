
import random


class Token:
    #convention says use self, but im going to use this because
    #this is more intuitive
    def __init__(this, symbol, isSolid):
        this.char = symbol
        this.exists = isSolid
    

class Board:
    def __init__(this, w, h):
        this.width = w
        this.height = h
        this.board = [ [Token("+", False) for x in range(0,this.width)] for y in range(0, this.height)  ]

    def getColHeight(this, colNum):
        someH = 0
        ##runtime here is still o(1) so lets just chill w it
        for x in range(0,this.height):
            if (this.board[x][colNum].exists):
                someH += 1
        return(someH)

    ##it should eb a given that there WILL BE SPACE FOR IT
    def dropToken(this, someToken, someColumn):
        onRow = 0

        # this.board[onRow][someColumn] = someToken
        while( onRow + 1 < len(this.board)):
            if this.board[onRow + 1][someColumn].exists:
                this.board[onRow][someColumn] = someToken
                return onRow
            else:
                onRow += 1
        ##if anything gets here, its one away from teh last row
        if onRow + 1 == len(this.board) and not this.board[onRow][someColumn].exists:
            this.board[onRow][someColumn] = someToken
            return onRow
            

    def printRow(this, rowNum):
        someString = str(rowNum) + " "
        for x in range(len(this.board[rowNum])):
            someString += this.board[rowNum][x].char + " "
        print(someString)
    
    def printBoard(this):
        someString = "  "
        for x in range(this.width):
            someString += str(x) + " "
        print(someString)
        for x in range(len(this.board)):
            this.printRow(int(x))
    
    def printColumn(this, colNum, prefix):
        someString = str(prefix)
        for x in range(len(this.board)):
            someString += this.board[x][colNum].char 
        print(someString)

    def printRaw(this, lastCol):
        this.printColumn(lastCol, "C" + str(lastCol))
        for x in range(this.width):
            this.printColumn(int(x), x)

    def findSolution(this, symbol, row, col):
        #im not exercising my brain for this and my last solution chekcer broke so im going to
        #be lazy and just brute force


        tokensPerDirection = [0,0,0,0,0,0,0,0,0] #corresponds to N, NE, E, SE, S, SW, W, NW  ; EDIT: just realized you cant have up, but im leaving it there
        checkDirections = [True,True,True,True,True,True,True,True]
        ##LEFT HAND LOOPS
        for x in range(1,col + 1):
            
            #WEST
            if (checkDirections[6]  ):
                # if (x == 0):
                #     tokensPerDirection[6] -= 1
                if (this.board[row][col - x].char == symbol):
                    tokensPerDirection[6] += 1
                else:
                    checkDirections[6] = False

            #NORTHWEST
            if (checkDirections[7] and col - x >= 0):
                # if (x == 0):
                #     tokensPerDirection[7] -= 1
                if (this.board[row - x][col - x].char == symbol):
                    tokensPerDirection[7] += 1
                else:
                    checkDirections[7] = False

            #SOUTHWEST
            if (checkDirections[5] and row + x < this.height):
                # if (x == 0):
                #     tokensPerDirection[5] -= 1
                if (this.board[row + x][col - x].char == symbol):
                    tokensPerDirection[5] += 1
                else:
                    checkDirections[5] = False
        
        for x in range(1,this.width - col):

            
            #EAST
            if (checkDirections[2]  ):
                # if (x == 0):
                #     tokensPerDirection[2] -= 1
                if (this.board[row][col + x].char == symbol):
                    tokensPerDirection[2] += 1
                else:
                    checkDirections[2] = False
            
            #NORTHEAST
            if (checkDirections[1] and col - x > 0):
                # if (x == 0):
                #     tokensPerDirection[1] -= 1
                if (this.board[row - x][col + x].char == symbol):
                    tokensPerDirection[1] += 1
                else:
                    checkDirections[1] = False
            
            
            #SOUTHEAST
            if (checkDirections[3] and row + x < this.height):
                # if (x == 0):
                #     tokensPerDirection[3] -= 1
                if (this.board[row + x][col + x].char == symbol):
                    tokensPerDirection[3] += 1
                else:
                    
                    checkDirections[3] = False
                    
        for x in range(1,this.height - row):
            if (checkDirections[4]):
                # if (x == 0):
                #     tokensPerDirection[4] -= 1

                if (this.board[row + x][col].char == symbol):
                    tokensPerDirection[4] += 1
                else:

                    checkDirections[4] = False
        


        linesFormed = [tokensPerDirection[0 + x] + tokensPerDirection[4 + x] for x in range(0,4)]

        return(linesFormed)
    
    def searchTie(this):
        for x in this.board[0]:
            if not x.exists :
                return False
        return True
            
            
def findOver(someAr, someInt):
    for x in someAr:
        if x > someInt:
            return True
    return False                             

def playerTurn():
    global con4


    #im not adding stupidproof to this; if the player wants to be a dumbass, let them be
    col = int(input())
    if (col >= 0 and col < con4.width):
        someRow = con4.dropToken(Token("O",True), col)
        # con4.printBoard()
        con4.printRaw(col);
        if (findOver( con4.findSolution( "O", someRow, col), 2 )):
            print("9PWIN||");
        else:
            if (con4.searchTie()):
                con4 = None
                con4 = Board(7,6)
                print("9PCLR||")
            else:
                print("9PEND||")
            botTurn()
    else:
        playerTurn()

def botTurn():
    global con4


    someCol = random.randint(0,6)

    while con4.getColHeight(someCol) == con4.height :
        someCol = random.randint(0,6)
    someRow = con4.dropToken(Token("X",True), someCol)

    # con4.printBoard()
    con4.printRaw(someCol)
    if (findOver( con4.findSolution( "X", someRow, someCol), 2 )):
        print("9BWIN||");
    else:
        if (con4.searchTie()):
            con4 = None
            con4 = Board(7,6)
            print("9BCLR||")
        else:
            print("9BEND||")
        playerTurn()

           


con4 = Board(7,6);

# k = con4.dropToken( Token("O", True), 1 );
# print(k)


#player 0 is O player 1 is X
#player always go first


playerTurn()






        
        
