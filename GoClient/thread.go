package main

import (
	"fmt"
	"strconv"
	"sync"
)

var wg sync.WaitGroup

func f(n int) {
	fmt.Println("Thread No", n)
	defer wg.Done()
	for i := 0; i < n; i++ {
		fmt.Println(n)
	}
}

func main() {
	var num, i int
	i = 0
	fmt.Printf("Enter the number of threads:")
	fmt.Scanln(&num)

	wg.Add(num)

	for i = 0; i < num; i++ {
		//var str bytes.Buffer
		//str.WriteString("deviceName")
		//str.WriteString(strconv.Itoa(i))
		fmt.Println("DeviceName" + strconv.Itoa(i))
		//fmt.Println(str.String())
		go f(i)
	}
	wg.Wait()
	return
}

// func chatApp() {
// 	var input string
// 	log.Println("\nConnected to Server. Plz start sending data..")
// 	scanner := bufio.NewScanner(os.Stdin)
// 	buf := make([]byte, 1000)
// 	input = "1"

// 	for len(input) != 0 && input != "Bye" {
// 		n, err := conn.Read(buf)
// 		if err != nil {
// 			log.Println(n, err)
// 			return
// 		}
// 		println("Server >", string(buf[:n]))
// 		fmt.Printf("Console >>")
// 		scanner.Scan()
// 		input = scanner.Text()
// 		copy(buf[:], input)
// 		n, err = conn.Write(buf[:len(input)])
// 		if err != nil {
// 			log.Println(n, err)
// 			return
// 		}
// 	}
// }
