import { Play } from 'phosphor-react'
import {
  CountdownContainer,
  FormContainer,
  HomeContainer,
  MinutesAmountInput,
  Separator,
  StartCountdownButton,
  TaskInput,
} from './styles'
import { useForm } from 'react-hook-form'
import { useEffect, useState } from 'react'
import { differenceInSeconds } from 'date-fns'

interface NewCycleFormData {
  task: string
  minuteAmount: number
}

interface Cycle {
  id: string
  task: string
  minuteAmount: number
  startDate: Date
}

export function Home() {
  const [cycles, setCycles] = useState<Cycle[]>([])
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null)
  const [amountSecondsLeft, setAmountSecondsLeft] = useState(0)

  const { register, handleSubmit, watch, reset } = useForm({
    defaultValues: {
      task: '',
      minuteAmount: 0,
    },
  })

  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

  useEffect(() => {
    if (activeCycle) {
      setInterval(() => {
        setAmountSecondsLeft(
          differenceInSeconds(new Date(), activeCycle.startDate),
        )
      }, 1000)
    }
  }, [activeCycle])

  const task = watch('task')
  const isSubmitDisabled = !task
  const totalSeconds = activeCycle ? activeCycle.minuteAmount * 60 : 0
  const currentSeconds = activeCycle ? totalSeconds - amountSecondsLeft : 0
  const minutesAmount = Math.floor(currentSeconds / 60)
  const secondsAmount = currentSeconds % 60
  const minutes = String(minutesAmount).padStart(2, '0')
  const seconds = String(secondsAmount).padStart(2, '0')

  function handleCreateNewCycle(data: NewCycleFormData) {
    const newId = String(new Date().getTime())

    const newCycle: Cycle = {
      id: newId,
      task: data.task,
      minuteAmount: data.minuteAmount,
      startDate: new Date(),
    }

    setCycles((state) => [...cycles, newCycle])
    setActiveCycleId(newId)
    reset()
  }

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)} action="">
        <FormContainer>
          <label htmlFor="task">Vou trabalhar em</label>
          <TaskInput
            id="task"
            placeholder="Dê um nome para o seu projeto"
            list="task-suggestions"
            {...register('task')}
          />

          <datalist id="task-suggestions">
            <option value="Projeto 01" />
            <option value="Projeto 02" />
            <option value="Projeto 03" />
          </datalist>

          <label htmlFor="minuteAmount">durante</label>
          <MinutesAmountInput
            id="minutesAmount"
            type="number"
            placeholder="00"
            step={5}
            min={5}
            max={60}
            {...register('minuteAmount', { valueAsNumber: true })}
          />

          <span>minutos.</span>
        </FormContainer>

        <CountdownContainer>
          <span>{minutes[0]}</span>
          <span>{minutes[1]}</span>
          <Separator>:</Separator>
          <span>{seconds[0]}</span>
          <span>{seconds[1]}</span>
        </CountdownContainer>

        <StartCountdownButton disabled={isSubmitDisabled} type="submit">
          <Play size={24} />
          Começar
        </StartCountdownButton>
      </form>
    </HomeContainer>
  )
}
