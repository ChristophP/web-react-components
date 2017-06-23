module Main exposing (..)

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Json.Encode as Encode
import Json.Decode as Decode exposing (Decoder)


main =
    beginnerProgram { model = model, update = update, view = view }


type alias Model =
    { disabled : Bool
    , value : String
    , name : String
    }


type Msg
    = ToggleDisabled
    | ToggleValue
    | ChangeValue String
    | ChangeName String


model =
    Model False "one" "form-field-name"


update msg model =
    case msg of
        ToggleDisabled ->
            { model | disabled = not model.disabled }

        ToggleValue ->
            { model
                | value =
                    if model.value == "one" then
                        "two"
                    else
                        "one"
            }

        ChangeValue val ->
            let
                _ =
                    Debug.log "value changed from Elm" val
            in
                { model | value = val }

        ChangeName name ->
            { model | name = name }


onChange : (String -> Msg) -> Html.Attribute Msg
onChange tagger =
    on "onChange" (Decode.map tagger detailTargetValueDecoder)



{- IMPORTANT: We need to get the data of the original React event like
   this : event.detail[0].target.value
-}


detailTargetValueDecoder : Decoder String
detailTargetValueDecoder =
    Decode.field "detail" <|
        Decode.index 0 <|
            Decode.at [ "target", "value" ] Decode.string


customSelect =
    node "custom-select"


view model =
    div []
        [ h3 [] [ text "Custom select component" ]
        , div []
            [ customSelect
                [ id "customComponent"
                , attribute "name" model.name
                , attribute "value" model.value
                , property "disabled" (Encode.bool model.disabled)
                , attribute "options"
                    "[{ \"value\": \"one\", \"label\": \"One\" },{ \"value\": \"two\", \"label\": \"Two\" }]"
                , onChange ChangeValue
                ]
                [ text "Select cool stuff" ]
            ]
        , div []
            [ button [ onClick ToggleDisabled ] [ text "toggle disabled" ]
            , button [ onClick ToggleValue ] [ text "toggle value" ]
            , label []
                [ text "Change name"
                , input [ onInput ChangeName, value model.name ] []
                ]
            ]
        ]
