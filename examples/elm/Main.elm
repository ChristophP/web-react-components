module Main exposing (..)

import Html exposing (Html, Attribute, h3, div, label, beginnerProgram, input, button, text, node)
import Html.Attributes exposing (style, id, name, value, disabled, attribute, property)
import Html.Events exposing (onClick, onInput, on)
import Json.Encode as Encode
import Json.Decode as Decode exposing (Decoder)


main : Program Never Model Msg
main =
    beginnerProgram { model = model, update = update, view = view }


type alias Model =
    { disabled : Bool
    , value : String
    , name : String
    , hasError : Bool
    }


type Msg
    = ToggleDisabled
    | ToggleValue
    | ChangeValue String
    | ChangeName String
    | ToggleError


{-| Encoded JSON data to pass to the web component
-}
optionsValue : Encode.Value
optionsValue =
    Encode.list
        [ Encode.object
            [ ( "value", Encode.string "one" )
            , ( "label", Encode.string "One" )
            ]
        , Encode.object
            [ ( "value", Encode.string "two" )
            , ( "label", Encode.string "Two" )
            ]
        ]


model : Model
model =
    Model False "one" "form-field-name" False


update : Msg -> Model -> Model
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

        ToggleError ->
            { model | hasError = not model.hasError }


onChange : (String -> Msg) -> Html.Attribute Msg
onChange tagger =
    on "onChange" (Decode.map tagger detailTargetValueDecoder)


{-| IMPORTANT: We need to get the data of the original React event like
   this : event.detail[0].target.value
-}
detailTargetValueDecoder : Decoder String
detailTargetValueDecoder =
    Decode.field "detail" <|
        Decode.index 0 <|
            Decode.at [ "target", "value" ] Decode.string


{-| Create shorthand for custom element
-}
customSelect : List (Attribute msg) -> List (Html msg) -> Html msg
customSelect =
    node "custom-select"


{-| Create shorthand for custom property. Property is easier to use
than attribute for Boolean values.
-}
hasError : Bool -> Attribute Msg
hasError =
    property "hasError" << Encode.bool


{-| Create shorthand for options property
-}
options : Encode.Value -> Attribute Msg
options =
    property "options"


view : Model -> Html Msg
view model =
    div []
        [ h3 [] [ text "Custom select component" ]
        , div []
            [ customSelect
                [ id "customComponent"
                , name model.name
                , value model.value
                , disabled model.disabled
                , hasError model.hasError
                , options optionsValue
                , onChange ChangeValue
                ]
                [ text "Select cool stuff" ]
            ]
        , div []
            [ button [ onClick ToggleDisabled ] [ text "toggle disabled" ]
            , button [ onClick ToggleValue ] [ text "toggle value" ]
            , button [ onClick ToggleError ] [ text "toggle error" ]
            , label []
                [ text "Change name"
                , input [ onInput ChangeName, value model.name ] []
                ]
            ]
        ]
