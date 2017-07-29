package main

import "fmt"

//import "crypto/tls"

type numSock struct {
	deviceName string
	currdate   string
	speed      int
}

func main() {

	var a int
	var sockObj numSock
	var a1 *numSock

	sockObj.deviceName = "Device1"
	sockObj.currdate = "07/24/2017"
	sockObj.speed = 25
	a1 = new(numSock)
	a1.deviceName = "abc"
	fmt.Println("This is new variable ", sockObj.deviceName, a)
	fmt.Println("This is new variable ", a1.deviceName)

}
