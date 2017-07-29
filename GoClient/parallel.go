package main

import (
	"fmt"
	"runtime"
	"sync"
)

// Parallelize parallelizes the function calls
func Parallelize(functions ...func()) {
	var waitGroup sync.WaitGroup
	waitGroup.Add(len(functions))
	defer waitGroup.Wait()
	for _, function := range functions {
		go func(copy func()) {
			defer waitGroup.Done()
			copy()
		}(function)
	}
}

func f(a int) {
	fmt.Println("Val ", a)
}

func main() {

	fmt.Println("Max Procs", runtime.GOMAXPROCS(1))

	func1 := func() {
		f(0)
	}

	func2 := func() {
		f(1)
	}

	func3 := func() {
		f(2)
	}

	Parallelize(func1, func2, func3)

}
