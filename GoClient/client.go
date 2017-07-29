package main

import (
	"crypto/tls"
	"encoding/json"
	"fmt"
	"log"
	"strconv"
	"sync"
	"time"
)

var wg sync.WaitGroup

func makeData(deviceNo, incCount int) map[string]string {
	var Record map[string]string

	Record = make(map[string]string)
	// `Format` and `Parse` use example-based layouts. Usually
	// you'll use a constant from `time` for these layouts, but
	// you can also supply custom layouts. Layouts must use the
	// reference time `Mon Jan 2 15:04:05 MST 2006` to show the
	// pattern with which to format/parse a given time/string.
	// The example time must be exactly as shown: the year 2006,
	// 15 for the hour, Monday for the day of the week, etc.
	//p(t.Format("3:04PM"))
	//p(t.Format("Mon Jan _2 15:04:05 2006"))

	currDateTime := time.Now() //.Format(time.RFC3339)

	Record["device"] = "Device" + strconv.Itoa(deviceNo)
	Record["currDate"] = currDateTime.Format("20060102")
	Record["time"] = currDateTime.Format("150405")
	Record["longitude"] = "1234"
	Record["latitude"] = "1234.566"

	Record["speed"] = strconv.Itoa(incCount + 46)
	Record["status"] = "0x0A"

	return Record
}

func clientSpawn(deviceNo, streamRec int) {
	defer wg.Done()
	cert, err := tls.LoadX509KeyPair("../certs/client.pem", "../certs/client.key")
	if err != nil {
		log.Fatalf("server: loadkeys: %s", err)
	}
	conf := &tls.Config{Certificates: []tls.Certificate{cert}, InsecureSkipVerify: true}
	conn, err := tls.Dial("tcp", "127.0.0.1:443", conf)
	if err != nil {
		log.Println(err)
		return
	}
	defer conn.Close()
	log.Println("Device ", deviceNo, "client: connected to: ", conn.RemoteAddr())
	buf := make([]byte, 1000)
	n, err := conn.Read(buf)
	if err != nil {
		log.Println(n, err)
		return
	}
	for i := 0; i < streamRec; i++ {
		m := makeData(deviceNo, i)
		//fmt.Println(m, duration)
		j, err := json.Marshal(m)
		if err != nil {
			log.Println(n, err)
			return
		}
		copy(buf[:], j)

		n, err = conn.Write(buf[:len(j)])
		if err != nil {
			log.Println(n, err)
			return
		}
		fmt.Println("Sent", i, "Chunk to server.Device  ", deviceNo, "sleeing for 10 seconds")
		time.Sleep(time.Second * 2)
	}
	conn.Close()
	fmt.Println("Device ", deviceNo, "Finished it;s work.")
}
func main() {

	log.SetFlags(log.Lshortfile)
	var inpDevices, streamChunk int
	fmt.Println("Enter number of devices to Connect: ")
	fmt.Scanln(&inpDevices)
	fmt.Println("Enter Stream Records: ")
	fmt.Scanln(&streamChunk)
	wg.Add(inpDevices)
	for i := 0; i < inpDevices; i++ {
		time.Sleep(time.Second)
		go clientSpawn(i, streamChunk)
	}
	//this will wait for all the threads completes it's execution and then return to main thread
	wg.Wait()
	return

}
