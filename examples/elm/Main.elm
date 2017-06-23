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
    }


type Msg
    = ToggleDisabled
    | ToggleValue
    | Change String


model =
    Model False "one"


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

        Change val ->
            let
                _ =
                    Debug.log "value changed" val
            in
                { model | value = val }


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
        [ div []
            [ customSelect
                [ id "customComponent"
                , attribute "name" "form-field-name"
                , attribute "value" model.value
                , property "disabled" (Encode.bool model.disabled)
                , attribute "options"
                    "[{ \"value\": \"one\", \"label\": \"One\" },{ \"value\": \"two\", \"label\": \"Two\" }]"
                , onChange Change
                ]
                [ h3 [] [ b [] [ text "Select cool stuff" ] ]
                ]
            ]
        , div []
            [ button [ onClick ToggleDisabled ] [ text "toggle disabled" ]
            , button [ onClick ToggleValue ] [ text "toggle value" ]
            ]
        ]
